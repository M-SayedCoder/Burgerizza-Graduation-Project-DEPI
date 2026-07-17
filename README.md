# 🍔 Burgerizza - Backend API

> Restaurant Management & Online Ordering System - Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)

---

# 📋 About the Project

Burgerizza is a complete Restaurant Management and Online Ordering System. This backend provides a secure and scalable RESTful API that handles:

* 🔐 User Authentication using JWT
* 👤 User Management with Role-Based Access Control (Customer, Manager, Admin)
* 🍔 Menu Management (Create, Read, Update, Delete)
* 🛡️ Secure API Routes with JWT Authentication and RBAC

---

# 🚀 Technologies Used

| Technology             | Purpose                       |
| ---------------------- | ----------------------------- |
| **Node.js**            | Runtime Environment           |
| **Express.js**         | Backend Framework             |
| **MongoDB Atlas**      | Cloud Database                |
| **Mongoose**           | MongoDB ODM                   |
| **JWT (jsonwebtoken)** | Authentication                |
| **bcryptjs**           | Password Hashing              |
| **express-validator**  | Request Validation            |
| **dotenv**             | Environment Variables         |
| **cors**               | Cross-Origin Resource Sharing |
| **helmet**             | HTTP Security Headers         |

---

# 📁 Project Structure

```text
Burgerizza-Backend/
├── controllers/
│   ├── authController.js
│   └── menuController.js
├── models/
│   ├── User.js
│   └── MenuItem.js
├── routes/
│   ├── authRoutes.js
│   └── menuRoutes.js
├── middlewares/
│   └── auth.js
├── validators/
│   ├── auth.validator.js
│   └── menu.validator.js
├── utils/
│   └── responseHandler.js
├── app.js
├── server.js
├── .env
├── package.json
└── README.md
```

---

# 🛠️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/Burgerizza-Backend.git
cd Burgerizza-Backend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/burgerizza
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

## 4. Run the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

---

# 📡 API Endpoints

## Base URL

```text
http://localhost:5000/api
```

---

# 🔐 Authentication

| Method | Endpoint         | Description              | Protected |
| ------ | ---------------- | ------------------------ | --------- |
| POST   | `/auth/register` | Register a new user      | ❌         |
| POST   | `/auth/login`    | User login               | ❌         |
| GET    | `/auth/me`       | Get current user profile | ✅         |

## Register Example

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "password": "123456",
  "phone": "01012345678",
  "role": "customer"
}
```

## Login Example

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "123456"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "67c8f2d4...",
      "name": "Ahmed Mohamed",
      "email": "ahmed@example.com",
      "role": "customer"
    }
  }
}
```

---

# 🍔 Menu

| Method | Endpoint           | Description              | Protected         |
| ------ | ------------------ | ------------------------ | ----------------- |
| GET    | `/menu`            | Get all menu items       | ❌                 |
| GET    | `/menu/:id`        | Get a single menu item   | ❌                 |
| POST   | `/menu`            | Create a new menu item   | ✅ (Manager/Admin) |
| PUT    | `/menu/:id`        | Update a menu item       | ✅ (Manager/Admin) |
| DELETE | `/menu/:id`        | Delete a menu item       | ✅ (Manager/Admin) |
| PATCH  | `/menu/:id/toggle` | Toggle item availability | ✅ (Manager/Admin) |

---

# 🔐 Authentication & Authorization

## Authentication Flow

1. User registers with a hashed password using **bcrypt**.
2. User logs in with email and password.
3. A **JWT Token** is generated and returned.
4. Protected routes require the following header:

```http
Authorization: Bearer <your_token>
```

5. The server verifies the token and checks the user's role before allowing access.

---

# 👥 User Roles

| Role         | Permissions                                                 |
| ------------ | ----------------------------------------------------------- |
| **Customer** | Browse the menu, register, login, and view personal profile |
| **Manager**  | Customer permissions + Full Menu Management (CRUD)          |
| **Admin**    | Full system access including administrative operations      |

---

# 🛡️ Security Features

| Feature                   | Implementation          |
| ------------------------- | ----------------------- |
| Password Hashing          | bcrypt (10 Salt Rounds) |
| JWT Authentication        | Secure JSON Web Tokens  |
| Role-Based Access Control | RBAC Middleware         |
| HTTP Security             | Helmet                  |
| CORS Protection           | Configurable CORS       |
| Input Validation          | express-validator       |

---

# 👥 Team Members

| Role                    | Member       |
| ----------------------- | ------------ |
| **Team Leader**         | Shehab Eldin |
| **Frontend Developers** | Team Members |
| **Backend Developers**  | Team Members |
| **QA Engineer**         | Team Member  |

---

# 📄 License

This project was developed as part of the **DEPI Graduation Project 2026**.

---

# 📬 Contact

For questions or support:

**Email:** **[shehabaldeeb@gmail.com](mailto:shehabaldeeb@gmail.com)**
