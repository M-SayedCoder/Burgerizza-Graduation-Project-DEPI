// __tests__/menu.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

let adminToken = '';
let customerToken = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burgerizza_test');
  
  // تسجيل مدير
  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'مدير',
      email: 'admin@test.com',
      password: '123456',
      role: 'admin'
    });
  adminToken = adminRes.body.data.token;

  // تسجيل عميل
  const customerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'عميل',
      email: 'customer@test.com',
      password: '123456'
    });
  customerToken = customerRes.body.data.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await MenuItem.deleteMany({});
  await mongoose.connection.close();
});

describe('🍔 Menu API Tests', () => {

  test('1. جلب المنيو (عام)', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('2. إضافة صنف (مدير فقط)', async () => {
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'برجر لحم',
        description: 'برجر لحم مع جبن',
        price: 120,
        category: 'برجر'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.item).toHaveProperty('name', 'برجر لحم');
  });

  test('3. منع العميل من إضافة صنف', async () => {
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'برجر دجاج',
        price: 100,
        category: 'برجر'
      });
    
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('4. تعديل صنف (مدير)', async () => {
    // جلب الصنف الأول
    const items = await request(app).get('/api/menu');
    const itemId = items.body.data.items[0]._id;

    const res = await request(app)
      .put(`/api/menu/${itemId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'برجر لحم كبير'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.item).toHaveProperty('name', 'برجر لحم كبير');
  });

  test('5. حذف صنف (مدير)', async () => {
    const items = await request(app).get('/api/menu');
    const itemId = items.body.data.items[0]._id;

    const res = await request(app)
      .delete(`/api/menu/${itemId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});