# Burgerizza Backend - Restaurant Management System API

Burgerizza is a full-stack, single-restaurant management application. This repository hosts the Node.js / Express backend REST API implementing MVC architecture, Mongoose database models, and JWT-based role-based access validation.

---

## 1. Backend Architecture

The application is structured around MVC boundaries with isolated middleware, validation, routing, and controller layers:

```text
backend/
├── controllers/
│   ├── adminController.js         # Admin dashboard aggregation endpoints
│   ├── orderController.js         # Order CRUD and scoping logic
│   └── reservationController.js   # Reservation CRUD and duplicate checking logic
├── models/
│   ├── MenuItem.js                # Food items and price listings
│   ├── Order.js                   # Customer order transactions
│   ├── Reservation.js             # Booking slots and table controls
│   └── User.js                    # Identity directory and roles
├── routes/
│   ├── adminRoutes.js             # /api/admin endpoints
│   ├── orderRoutes.js             # /api/orders endpoints
│   └── reservationRoutes.js       # /api/reservations endpoints
├── middlewares/
│   └── auth.js                    # JWT extraction and role validation
├── validators/
│   ├── order.validator.js         # Input sanitization for orders
│   └── reservation.validator.js   # Format and range rules for bookings
├── utils/
│   └── seed.js                    # Database seeder utility
├── .env.example                   # Environment configuration example
├── app.js                         # Application express configuration and mounting
└── server.js                      # DB bootstrapping and network listener
```

---

## 2. Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or via connection string)

### 1. Install Dependencies
Navigate to the `backend/` directory and run:
```bash
npm install express mongoose jsonwebtoken dotenv cors
# Or if package.json is not configured yet, initialize first:
# npm init -y && npm install express mongoose jsonwebtoken dotenv cors
```
*(Optional: Install `bcryptjs` for secure password hashing).*
```bash
npm install bcryptjs
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and adjust the variables:
```bash
cp .env.example .env
```
Default parameters in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/burgeriza
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Seed Sample Data
Populate the database with mock users (customer, manager, admin), menu items, sample orders, and reservations:
```bash
node utils/seed.js
```
*(Warning: This clears any existing records in the `users`, `menuitems`, `orders`, and `reservations` collections).*

### 4. Start the Server
Run the local development server:
```bash
node server.js
```
The server will boot and output:
```text
Successfully connected to MongoDB.
Server is running on port 5000
```

---

## 3. API Overview

All request and response objects adhere to REST specifications and standard formats.

### Security Roles
* **customer**: Book reservations, modify own pending reservations, submit orders, and view own records only.
* **manager**: Read and list all orders/reservations, update order status, and update reservation status.
* **admin**: Full permissions (delete documents, read dashboards, create orders/reservations on behalf of any customer).

---

### Endpoint Catalog

#### Authentication & Scoping Headers
All protected requests require a JWT bearer token:
`Authorization: Bearer <JWT_TOKEN>`

#### Orders
* `POST /api/orders` (customer, admin) — Submit an order (price resolved on DB).
* `GET /api/orders` (customer, manager, admin) — Paginated lists (customers only view own).
* `GET /api/orders/:id` (customer, manager, admin) — Get detailed order summary.
* `PUT /api/orders/:id/status` (manager, admin) — Update workflow stage.
* `DELETE /api/orders/:id` (admin only) — Delete an order record.

#### Reservations
* `POST /api/reservations` (customer, admin) — Request table booking (conflict checking active).
* `GET /api/reservations` (customer, manager, admin) — Paginated bookings list.
* `GET /api/reservations/:id` (customer, manager, admin) — Detailed booking overview.
* `PUT /api/reservations/:id` (customer, admin) — Modify details (allowed only while `status` is `Pending`).
* `PUT /api/reservations/:id/status` (manager, admin) — Confirm/Reject/Cancel reservation.
* `DELETE /api/reservations/:id` (admin only) — Delete booking slot.

#### Admin Dashboard
* `GET /api/admin/dashboard` (admin only) — Analytics numbers (revenue, status counts).
* `GET /api/admin/stats` (admin only) — Daily revenue/order trends for the last 7 days.
* `GET /api/admin/orders-summary` (admin only) — Recent orders and AOV metrics.
* `GET /api/admin/reservations-summary` (admin only) — Recent reservations and totals.

---

## 4. Standard Response Formats

### Success Response (200 / 201)
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Error Response (400 / 401 / 403 / 404 / 409 / 500)
```json
{
  "success": false,
  "message": "Detailed error explanation here"
}
```
