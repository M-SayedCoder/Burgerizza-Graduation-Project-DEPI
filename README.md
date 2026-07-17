# 🍔 Burgerizza – Restaurant Management & Online Ordering System

### Graduation Project – DEPI Program 2026

A modern full-stack restaurant management and online ordering platform designed to streamline restaurant operations and enhance customer experience.

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-000000?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Status-Graduation_Project-success)

</div>

---

# 📖 Overview

Burgerizza is a comprehensive restaurant management and online ordering system developed as a graduation project within the Digital Egypt Pioneers Initiative (DEPI).

The platform provides an integrated solution for customers, restaurant staff, managers, and administrators by combining online ordering, reservations, menu management, inventory tracking, and business monitoring into a single ecosystem.

---

# 🎯 Project Objectives

* Improve customer ordering experience.
* Digitize restaurant operations.
* Manage menus and inventory efficiently.
* Enable online reservations.
* Provide business insights through dashboards.
* Implement secure authentication and authorization.
* Deliver a scalable full-stack architecture.

---

# ✨ Key Features

## Customer Features

* User Registration & Login
* JWT Authentication
* Browse Restaurant Menu
* Search & Filter Products
* Add Items to Cart
* Place Online Orders
* Order Tracking
* Reservation Booking
* Profile Management
* Notification System

## Restaurant Management Features

* Menu Management
* Inventory Management
* Order Management
* Reservation Management
* Customer Management
* Notification Management

## Admin Features

* Admin Dashboard
* Revenue Monitoring
* Order Analytics
* User Management
* System Monitoring
* Role-Based Access Control (RBAC)

---

# 🏗️ System Architecture

```text
┌─────────────────┐
│   React Frontend │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│ Express Backend │
└────────┬────────┘
         ▼
┌─────────────────┐
│    MongoDB      │
└─────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Modern Responsive UI

## Backend

* Node.js
* Express.js
* JWT Authentication
* Middleware Architecture
* RESTful APIs

## Database

* MongoDB Atlas
* Mongoose ODM

## Security

* JWT Authentication
* Password Hashing (bcryptjs)
* Protected Routes
* Input Validation
* Helmet Security Headers

## Testing

* Jest
* Supertest

---

# 📂 Project Structure

```text
Burgerizza/
│
├── frontend/
│   ├── src/
│   ├── assets/
│   ├── pages/
│   ├── components/
│   └── services/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── tests/
│   ├── uploads/
│   ├── app.js
│   └── server.js
│
├── docs/
├── README.md
└── .gitignore
```

---

# 🔐 Authentication & Authorization

The system uses JWT-based authentication with role-based access control.

### Roles

| Role     | Permissions                |
| -------- | -------------------------- |
| Customer | Place Orders, Reservations |
| Manager  | Manage Operations          |
| Admin    | Full System Access         |

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/burgerizza.git
cd burgerizza
```

## 2. Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 📡 API Documentation

The backend provides RESTful APIs for:

* Authentication
* Users
* Menu
* Orders
* Reservations
* Inventory
* Notifications
* Admin Dashboard

Swagger documentation is available through:

```bash
/api-docs
```

---

# 🧪 Testing

Run automated tests:

```bash
npm test
```

Tests include:

* Authentication Tests
* Menu Tests
* Inventory Tests
* Route Tests
* Validation Tests

---

# 📈 Future Enhancements

* Payment Gateway Integration
* AI-Based Recommendations
* Real-Time Notifications
* Mobile Application
* Multi-Restaurant Support
* Advanced Analytics Dashboard
* Docker Deployment
* CI/CD Pipeline

---

# 👨‍💻 Development Team

### Graduation Project Team

* Frontend Developers
* Backend Developers
* Database Engineers
* QA & Testing Contributors

Developed as part of the **Digital Egypt Pioneers Initiative (DEPI)**.

---

# 🎓 Academic Information

**Project Title:** Burgerizza – Restaurant Management & Online Ordering System

**Project Type:** Graduation Project

**Program:** Digital Egypt Pioneers Initiative (DEPI)

**Year:** 2026

---

# 📜 License

This project is developed for educational and academic purposes as a graduation project.

---

<div align="center">

### ⭐ If you like this project, don't forget to give it a star.

**Built with dedication, teamwork, and modern software engineering practices.**

</div>
