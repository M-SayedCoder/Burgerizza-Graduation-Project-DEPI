# 🍔 Burgerizza - Backend API

> Restaurant Management & Online Ordering System - Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)

---

## 📋 عن المشروع

Burgerizza هو نظام متكامل لإدارة المطاعم والطلب عبر الإنترنت. هذا الـ Backend يوفر واجهة API آمنة ومتطورة للتعامل مع:

- 🔐 **المصادقة** (تسجيل/دخول) باستخدام JWT
- 👤 **إدارة المستخدمين** بصلاحيات مختلفة (عميل، مدير، أدمن)
- 🍔 **إدارة المنيو** (إضافة، تعديل، حذف، عرض)
- 🛡️ **حماية** كاملة للمسارات باستخدام RBAC

---

## 🚀 التقنيات المستخدمة

| التقنية | الاستخدام |
|----------|-----------|
| **Node.js** | بيئة التشغيل |
| **Express.js** | إطار العمل الرئيسي |
| **MongoDB Atlas** | قاعدة البيانات السحابية |
| **Mongoose** | ODM للتعامل مع MongoDB |
| **JWT** | المصادقة والتوكنات |
| **bcryptjs** | تشفير كلمة المرور |
| **express-validator** | التحقق من صحة المدخلات |
| **dotenv** | إدارة متغيرات البيئة |
| **cors** | السماح بالطلبات من الواجهة الأمامية |
| **helmet** | حماية HTTP headers |

---

## 📁 هيكل المشروع

```
Burgerizza-Backend/
├── controllers/
│   ├── authController.js      # التحكم في المصادقة
│   └── menuController.js      # التحكم في المنيو
├── models/
│   ├── User.js                # نموذج المستخدم
│   └── MenuItem.js            # نموذج الصنف
├── routes/
│   ├── authRoutes.js          # مسارات المصادقة
│   └── menuRoutes.js          # مسارات المنيو
├── middlewares/
│   └── auth.js                # JWT والصلاحيات
├── validators/
│   ├── auth.validator.js      # التحقق من بيانات المصادقة
│   └── menu.validator.js      # التحقق من بيانات المنيو
├── utils/
│   └── responseHandler.js     # توحيد الردود
├── app.js                     # تهيئة التطبيق
├── server.js                  # تشغيل السيرفر
├── .env                       # متغيرات البيئة
├── package.json               # الاعتماديات
└── README.md                  # هذا الملف
```

---

## 🛠️ التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone https://github.com/your-username/Burgerizza-Backend.git
cd Burgerizza-Backend
```

### 2. تثبيت الاعتماديات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env` في المجلد الرئيسي:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/burgerizza
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

### 4. تشغيل السيرفر

**وضع التطوير (مع إعادة تشغيل تلقائي):**
```bash
npm run dev
```

**وضع الإنتاج:**
```bash
npm start
```

---

## 📡 الـ API Endpoints

### قاعدة المسارات
```
BASE_URL = http://localhost:5000/api
```

### 🔐 المصادقة (Auth)

| الطريقة | المسار | الوظيفة | الحماية |
|---------|--------|---------|---------|
| POST | `/auth/register` | تسجيل مستخدم جديد | ❌ |
| POST | `/auth/login` | تسجيل الدخول | ❌ |
| GET | `/auth/me` | جلب بيانات المستخدم | ✅ (JWT) |

#### مثال: تسجيل مستخدم جديد

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "123456",
  "phone": "01012345678",
  "role": "customer"
}
```

#### مثال: تسجيل الدخول

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "123456"
}
```

**الـ Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "67c8f2d4...",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "role": "customer"
    }
  }
}
```

### 🍔 المنيو (Menu)

| الطريقة | المسار | الوظيفة | الحماية |
|---------|--------|---------|---------|
| GET | `/menu` | جلب كل الأصناف | ❌ |
| GET | `/menu/:id` | جلب صنف واحد | ❌ |
| POST | `/menu` | إضافة صنف جديد | ✅ (مدير/أدمن) |
| PUT | `/menu/:id` | تعديل صنف | ✅ (مدير/أدمن) |
| DELETE | `/menu/:id` | حذف صنف | ✅ (مدير/أدمن) |
| PATCH | `/menu/:id/toggle` | تبديل حالة التوفر | ✅ (مدير/أدمن) |

---

## 🔐 نظام المصادقة والصلاحيات

### آلية العمل

1. **التسجيل**: تشفير كلمة المرور باستخدام `bcrypt`
2. **تسجيل الدخول**: التحقق من البيانات وإرجاع `JWT token`
3. **الطلبات المحمية**: إرسال التوكن في الـ Header:
   ```
   Authorization: Bearer <token>
   ```
4. **الصلاحيات**: التحقق من دور المستخدم (`role`)

### الأدوار

| الدور | الصلاحيات |
|-------|-----------|
| **customer** | عرض المنيو، تسجيل دخول، عرض ملفه الشخصي |
| **manager** | كل صلاحيات العميل + إدارة المنيو (CRUD) |
| **admin** | كل صلاحيات المدير + لوحة تحكم |

---

## 🛡️ الأمان

| الميزة | التنفيذ |
|--------|---------|
| **تشفير كلمة المرور** | `bcrypt` (10 rounds) |
| **مصادقة JWT** | توكن بتوقيع إلكتروني |
| **صلاحيات RBAC** | التحكم بالدور في كل مسار محمي |
| **حماية HTTP** | `helmet` middleware |
| **CORS** | التحكم في المصادر المسموحة |
| **التحقق من المدخلات** | `express-validator` |

---

## 👥 فريق العمل

| الدور | الاسم |
|-------|-------|
| **Team Leader** | [اسمك] |
| **Frontend Developers** | [أسماء] |
| **Backend Developers** | [أسماء] |
| **QA Engineer** | [اسم] |

---

## 📝 الترخيص

هذا المشروع مقدم كجزء من مشروع تخرج DEPI 2026.

---

## 📞 التواصل

للاستفسارات أو المساعدة:

- 📧 البريد الإلكتروني: [your-email@example.com]
- 🐙 GitHub: [github.com/your-username]

---

**⭐ لا تنسى أن تضع نجمة (Star) على المستودع إذا أعجبك المشروع!**

---
