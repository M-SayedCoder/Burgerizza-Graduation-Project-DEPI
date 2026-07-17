# متطلبات الـ Backend لمشروع Burgerizza (Manager Dashboard)

هذا الملف يوضح جميع المتطلبات، الـ APIs، وهياكل البيانات التي يجب أن يبرمجها مطور الـ Backend ليتوافق المشروع بشكل كامل مع واجهة الـ Manager Dashboard التي تم بناؤها.

---

## 1. القواعد العامة (General Rules)

*   **Base URL:** جميع الـ APIs يجب أن تبدأ بـ `/api` (مثال: `/api/auth/login`).
*   **Database IDs:** يجب أن يكون المعرف باسم `_id` وليس `id` في جميع الـ Models.
*   **Images:** يجب أن يعود مسار الصورة كـ URL كامل (مثل `http://localhost:5000/uploads/burger.jpg`) وليس كملف `File`.
*   **Roles:** الصلاحيات ثابتة ومكتوبة بحروف صغيرة (lowercase): `customer`, `manager`, `admin`. الـ Dashboard الحالية تسمح فقط للـ `manager` والـ `admin` بالدخول.
*   **Authentication:** يعتمد على `JWT`. الـ Frontend يرسل التوكن في الـ Header بهذا الشكل: `Authorization: Bearer <token>`.

---

## 2. شكل الردود الثابت (Standard API Responses)

يجب أن تلتزم **جميع** الـ APIs بالشكل التالي للردود:

**الرد الناجح (Success):**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**الرد الناجح مع Pagination (للقوائم والجداول):**
```json
{
  "success": true,
  "data": [ ... ],
  "total": 150,     // العدد الكلي للعناصر
  "page": 1,        // الصفحة الحالية
  "pages": 15       // عدد الصفحات الكلي
}
```

**رد الأخطاء (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**أخطاء التحقق (Validation Errors):**
```json
{
  "success": false,
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Password is too short" }
  ]
}
```

---

## 3. الثوابت (Constants & Enums)

يجب الالتزام بهذه القيم نصياً في قاعدة البيانات والـ Backend:

*   **Categories (للمنيو):** `Burger`, `Pizza`, `Drinks`, `Desserts`, `Sides`
*   **Order Status (للطلبات):** `Pending`, `Confirmed`, `Preparing`, `Ready`, `Delivered`, `Cancelled`
*   **Reservation Status (للحجوزات):** `Pending`, `Confirmed`, `Rejected`, `Cancelled`
*   **Notification Types (للإشعارات):** `order`, `reservation`, `system`, `alert`

---

## 4. هياكل البيانات المطلوبة (Data Models)

هذه هي البيانات التي يتوقع الـ Frontend استلامها:

### User Object
```json
{
  "_id": "60d5ecb8b392...",
  "name": "Ahmed Manager",
  "email": "manager@burgerizza.com",
  "phone": "01012345678",
  "role": "manager"
}
```

### Menu Object (Meal)
```json
{
  "_id": "60d5ecc...",
  "name": "Double Smash Burger",
  "description": "Juicy beef patties...",
  "price": 160,
  "category": "Burger",
  "image": "http://localhost:5000/uploads/smash.jpg",
  "isAvailable": true
}
```

### Order Object
```json
{
  "_id": "60d5ecd...",
  "customer": {
    "_id": "60d5ece...",
    "name": "Sara Ahmed",
    "phone": "01198765432",
    "address": "12 Tahrir St, Cairo"
  },
  "items": [
    {
      "menuItemId": "60d5ecc...",
      "name": "Double Smash Burger",
      "quantity": 2,
      "price": 160
    }
  ],
  "total": 320,
  "status": "Pending",
  "createdAt": "2026-07-05T12:00:00.000Z"
}
```

### Reservation Object
```json
{
  "_id": "60d5ecf...",
  "customer": {
    "_id": "60d5ece...",
    "name": "Omar Hassan",
    "phone": "01234567890"
  },
  "date": "2026-07-10",
  "time": "19:30",
  "partySize": 4,
  "status": "Confirmed"
}
```

### Notification Object
```json
{
  "_id": "60d5ecg...",
  "title": "New Order",
  "message": "New order #o123 received",
  "type": "order",
  "isRead": false,
  "createdAt": "2026-07-05T12:05:00.000Z",
  "link": "/orders"
}
```

---

## 5. قائمة الـ APIs المطلوبة (Endpoints)

### 🔐 Authentication & Profile
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | تسجيل الدخول | `{ email, password }` |
| `GET` | `/api/auth/me` | جلب بيانات المستخدم الحالي | `Token in Header` |
| `POST` | `/api/auth/logout` | تسجيل الخروج | `Token in Header` |
| `PUT` | `/api/auth/profile` | تحديث بيانات المدير | `{ name, email, phone }` |
| `PUT` | `/api/auth/password`| تغيير كلمة المرور | `{ currentPassword, newPassword }`|

### 🍔 Menu (Meals) Management
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/menu` | جلب القائمة | يدعم Query: `page`, `limit`, `search`, `category`, `sort` |
| `GET` | `/api/menu/:id` | جلب وجبة واحدة | - |
| `POST` | `/api/menu` | إضافة وجبة جديدة | يرسل كـ **FormData** لأنه يحتوي على صورة (`image` file) |
| `PUT` | `/api/menu/:id` | تعديل وجبة | يرسل كـ **FormData** |
| `DELETE`| `/api/menu/:id` | مسح وجبة | - |
| `PUT` | `/api/menu/:id/toggle` | عكس حالة التوفر (`isAvailable`) | Toggle boolean value |

### 📦 Orders Management
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | جلب الطلبات | يدعم Query: `page`, `limit`, `search` (Customer/ID), `status`, `sort` |
| `GET` | `/api/orders/:id` | جلب تفاصيل الطلب | - |
| `PUT` | `/api/orders/:id/status`| تغيير حالة الطلب | Request Body: `{ "status": "Ready" }` |

### 📅 Reservations Management
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reservations` | جلب الحجوزات | يدعم Query: `page`, `limit`, `status` |
| `PUT` | `/api/reservations/:id` | تأكيد/رفض الحجز | Request Body: `{ "status": "Confirmed" }` |

### 🗄️ Inventory
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/inventory` | جلب جرد المكونات/الوجبات | يدعم Query: `page`, `limit`, `category`. (يمكن أن يعيد نفس بيانات الـ Menu) |
| `PUT` | `/api/inventory/:id` | تفعيل/إيقاف صنف | Toggle `isAvailable` |

### 🔔 Notifications
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | جلب جميع إشعارات المدير | مرتبة من الأحدث للأقدم |
| `PUT` | `/api/notifications/:id/read` | تحديد إشعار كمقروء | يغير `isRead` إلى `true` |
| `PUT` | `/api/notifications/read-all`| تحديد الكل كمقروء | - |
| `DELETE`| `/api/notifications/:id`| حذف إشعار محدد | - |
| `DELETE`| `/api/notifications` | حذف كل الإشعارات | (Clear All) |

---

## 6. ملاحظات للـ Backend Developer 💡

1.  **Pagination & Queries:** الـ Frontend مجهز لإرسال Queries مثل:
    `/api/menu?page=1&limit=10&search=burger&category=Pizza&sort=-price`
    تأكد من تطبيق فلاتر الـ MongoDB (أو قاعدة البيانات المستخدمة) لاستقبال هذه المتغيرات (req.query).
2.  **FormData in Menu:** عند عمل إضافة (POST) أو تعديل (PUT) للـ Menu، الـ Frontend يرسل البيانات بصيغة `multipart/form-data` بسبب الصورة. يرجى إعداد الـ (Multer) لاستقبال حقل `image`.
3.  **Authentication:** إذا رد الخادم بخطأ `401 Unauthorized`، فإن واجهة المدير مبرمجة لعمل طرد (Logout) بشكل تلقائي وتوجيهه لصفحة الدخول.
4.  **Mock Mode:** الواجهة تعمل حالياً في بيئة الـ Mock (بيانات وهمية). بمجرد جاهزية الـ APIs أعلاه، سيقوم مطور الـ Frontend بتغيير قيمة `USE_MOCK = false` في ملف `src/services/config.ts` ليعمل النظام متصلاً بالـ Backend بشكل فوري وبدون تغيير أي شيء في واجهة المستخدم.
