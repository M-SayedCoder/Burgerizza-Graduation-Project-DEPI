// __tests__/auth.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

let token = '';
let userId = '';

beforeAll(async () => {
  // الاتصال بقاعدة البيانات
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burgerizza_test');
});

afterAll(async () => {
  // مسح البيانات بعد الاختبارات
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('🔐 Auth API Tests', () => {
  
  test('1. تسجيل مستخدم جديد', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'أحمد',
        email: 'ahmed@test.com',
        password: '123456',
        phone: '01012345678'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty('email', 'ahmed@test.com');
    userId = res.body.data.user._id;
  });

  test('2. منع التسجيل بنفس الإيميل', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'أحمد',
        email: 'ahmed@test.com',
        password: '123456'
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('3. تسجيل الدخول', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ahmed@test.com',
        password: '123456'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  });

  test('4. جلب بيانات المستخدم (محمي)', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty('email', 'ahmed@test.com');
  });

  test('5. منع دخول بدون توكن', async () => {
    const res = await request(app)
      .get('/api/auth/me');
    
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});