# 🍔 Burgerizza Backend

<div align="center">

### Restaurant Management & Online Ordering System

Graduation Project – DEPI Program 2026

Backend API for managing restaurant operations including orders, reservations, inventory, authentication, and administration.

![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Swagger](https://img.shields.io/badge/API-Swagger-blue)
![License](https://img.shields.io/badge/License-Educational-lightgrey)

</div>

---

## 📌 Overview

Burgerizza Backend is a RESTful API developed as part of the **Burgerizza Graduation Project**.

The system provides the core business logic for restaurant management, enabling administrators and staff to manage:

* Customer Orders
* Table Reservations
* Inventory Tracking
* Authentication & Authorization
* Administrative Operations
* API Documentation

---

## 🎯 Project Objectives

* Digitize restaurant operations.
* Improve customer ordering experience.
* Streamline reservation management.
* Monitor inventory efficiently.
* Provide secure role-based access control.
* Deliver a scalable backend architecture.

---

## 🛠 Tech Stack

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime Environment   |
| Express.js | Backend Framework     |
| MongoDB    | Database              |
| Mongoose   | ODM                   |
| JWT        | Authentication        |
| bcryptjs   | Password Hashing      |
| Swagger UI | API Documentation     |
| dotenv     | Environment Variables |

---

## 📂 Project Structure

```text
backend/
│
├── controllers/
│   ├── adminController.js
│   ├── inventoryController.js
│   ├── orderController.js
│   └── reservationController.js
│
├── middlewares/
│   └── auth.js
│
├── models/
│   ├── User.js
│   ├── Order.js
│   ├── Reservation.js
│   ├── Inventory.js
│   └── MenuItem.js
│
├── routes/
│   ├── adminRoutes.js
│   ├── inventoryRoutes.js
│   ├── orderRoutes.js
│   └── reservationRoutes.js
│
├── validators/
│
├── utils/
│
├── tests/
│
├── swagger.json
├── app.js
└── server.js
```

---

## ✨ Features

### 🔐 Authentication & Security

* JWT Authentication
* Protected Routes
* Password Encryption with bcryptjs
* Role-based Access Control

### 📦 Inventory Management

* Add inventory items
* Update stock quantities
* Monitor availability
* Inventory validation

### 🛒 Order Management

* Create Orders
* Track Orders
* Update Order Status
* Order Validation

### 📅 Reservation Management

* Create Reservations
* Update Reservations
* Reservation Validation
* Reservation Tracking

### 👨‍💼 Administration

* Administrative Dashboard
* Business Monitoring
* Data Management

### 📄 API Documentation

* Interactive Swagger Documentation
* Endpoint Testing
* Request & Response Examples

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/burgerizza-backend.git
cd burgerizza-backend/backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Start Development Server

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

---

## 🌱 Seed Database

Populate the database with sample data:

```bash
npm run seed
```

---

## 📖 API Documentation

After starting the server, access Swagger Documentation:

```text
http://localhost:5000/api-docs
```

Swagger provides:

* Endpoint Descriptions
* Request Examples
* Response Examples
* Interactive Testing

---

## 🧪 Testing

Testing files are located inside:

```text
backend/tests/
```

Includes:

* Controller Testing
* Route Testing
* Validator Testing
* API Verification

---

## 🚀 Future Enhancements

* Payment Gateway Integration
* Email Notifications
* Real-time Order Tracking
* Analytics Dashboard
* Docker Deployment
* CI/CD Pipeline
* Microservices Architecture

---

## 👥 Development Team

Graduation Project Team – DEPI 2026

### Backend Team

* Mohamed Sayed
* Backend Developer

---

## 🎓 Academic Information

**Project:** Burgerizza – Restaurant Management & Online Ordering System

**Program:** DEPI (Digital Egypt Pioneers Initiative)

**Year:** 2026

**Category:** Graduation Project

---

## 📜 License

This project was developed for educational and academic purposes as part of the DEPI Graduation Program.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star.

Built with ❤️ by the Burgerizza Team

</div>
