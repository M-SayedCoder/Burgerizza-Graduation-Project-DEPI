# Burgerizza Backend - API QA Testing Checklist

This document contains the Quality Assurance (QA) checklist and Postman testing scenarios for the Burgerizza restaurant management backend.

---

## 1. QA Testing Checklist

- [ ] **Authentication & Token Handling**
  - [ ] Request without Authorization header (Expect: `401 Unauthorized`)
  - [ ] Request with malformed Token format, e.g., missing "Bearer " prefix (Expect: `401 Unauthorized`)
  - [ ] Request with expired or invalid signature token (Expect: `401 Unauthorized`)
  - [ ] Verification of token parsing context (`req.user` extraction check)

- [ ] **Role-Based Authorization Constraints**
  - [ ] Customer trying to fetch list of all orders/reservations (Expect: `403 Forbidden`)
  - [ ] Customer trying to fetch another user's order/reservation detail by ID (Expect: `403 Forbidden`)
  - [ ] Customer trying to edit another user's reservation (Expect: `403 Forbidden`)
  - [ ] Customer trying to update order status (Expect: `403 Forbidden`)
  - [ ] Customer trying to delete an order/reservation (Expect: `403 Forbidden`)
  - [ ] Manager trying to delete an order/reservation (Expect: `403 Forbidden`)
  - [ ] Manager/Admin accessing administrative endpoints (Expect: `200 OK`)

- [ ] **Validation Flow Checks**
  - [ ] POST Order with empty items array (Expect: `400 Bad Request`)
  - [ ] POST Order with invalid MongoDB ObjectIds (Expect: `400 Bad Request`)
  - [ ] POST Order with decimal or negative quantity values (Expect: `400 Bad Request`)
  - [ ] POST Reservation with a past date (Expect: `400 Bad Request`)
  - [ ] POST Reservation with an invalid time format (Expect: `400 Bad Request`)
  - [ ] POST Reservation with a non-integer or zero partySize (Expect: `400 Bad Request`)

- [ ] **Functional Logic & Conflict Scenarios**
  - [ ] POST Order automatically resolves prices from the Database and computes totals correctly.
  - [ ] POST Reservation duplicate prevention (identical customer, date, and time) (Expect: `409 Conflict`)
  - [ ] PUT Reservation editing allowed only for owner when status is 'Pending' (Expect: `200 OK`)
  - [ ] PUT Reservation editing rejected if status is 'Confirmed', 'Rejected', or 'Cancelled' (Expect: `400 Bad Request`)

- [ ] **Paging, Sorting, and Filters**
  - [ ] GET requests support pagination parameters `page` and `limit`
  - [ ] GET requests filter listings by `status`
  - [ ] GET Orders sorted by `createdAt` descending by default
  - [ ] GET Reservations sorted by `date` ascending by default

- [ ] **Admin Dashboard Aggregations**
  - [ ] GET Dashboard analytics using optimized DB aggregation `$facet`
  - [ ] GET stats showing daily reports for the last 7 days
  - [ ] GET summaries returning latest items, status grouped splits, and aggregates

---

## 2. Postman Testing Scenarios

Use the following test cases to structure your Postman collections. Set the `Authorization` header to `Bearer <TOKEN>` where token roles are defined below:

### Orders Module

| Method | Endpoint | Role Required | Payload | Exp. Code | Exp. Response Schema |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **POST** | `/api/orders` | `customer` | `{ "items": [{ "menuItem": "<ID>", "quantity": 2 }] }` | **201** | `{"success": true, "message": "Success", "data": { ... }}` |
| **POST** | `/api/orders` | `customer` | `{ "items": [] }` | **400** | `{"success": false, "message": "Items array is required..."}` |
| **GET** | `/api/orders` | `customer` | *None* | **200** | `{"success": true, "message": "Success", "data": { "orders": [...own only] }}` |
| **GET** | `/api/orders` | `manager` | *None* | **200** | `{"success": true, "message": "Success", "data": { "orders": [...all orders] }}` |
| **GET** | `/api/orders/:id` | `customer` | *None (Own ID)* | **200** | `{"success": true, "message": "Success", "data": { ... }}` |
| **GET** | `/api/orders/:id` | `customer` | *None (Other's ID)* | **403** | `{"success": false, "message": "Access denied..."}` |
| **PUT** | `/api/orders/:id/status` | `manager` | `{ "status": "Preparing" }` | **200** | `{"success": true, "message": "Success", "data": { ...status updated }}` |
| **PUT** | `/api/orders/:id/status` | `customer` | `{ "status": "Preparing" }` | **403** | `{"success": false, "message": "Forbidden..."}` |
| **DELETE** | `/api/orders/:id` | `manager` | *None* | **403** | `{"success": false, "message": "Forbidden..."}` |
| **DELETE** | `/api/orders/:id` | `admin` | *None* | **200** | `{"success": true, "message": "Success", "data": {}}` |

---

### Reservations Module

| Method | Endpoint | Role Required | Payload | Exp. Code | Exp. Response Schema |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **POST** | `/api/reservations` | `customer` | `{ "date": "2026-08-01", "time": "19:00", "partySize": 4 }` | **201** | `{"success": true, "message": "Success", "data": { ... }}` |
| **POST** | `/api/reservations` | `customer` | `{ "date": "2026-08-01", "time": "19:00" }` | **409** | `{"success": false, "message": "Conflict: An active reservation..."}` |
| **POST** | `/api/reservations` | `customer` | `{ "date": "2020-01-01", "time": "19:00", "partySize": 2 }` | **400** | `{"success": false, "message": "Invalid date..."}` |
| **GET** | `/api/reservations` | `customer` | *None* | **200** | `{"success": true, "message": "Success", "data": { "reservations": [...own] }}` |
| **GET** | `/api/reservations` | `manager` | *None* | **200** | `{"success": true, "message": "Success", "data": { "reservations": [...all] }}` |
| **PUT** | `/api/reservations/:id` | `customer` | `{ "time": "20:00" }` *(Own pending)* | **200** | `{"success": true, "message": "Success", "data": { ... }}` |
| **PUT** | `/api/reservations/:id` | `customer` | `{ "time": "20:00" }` *(Own confirmed)* | **400** | `{"success": false, "message": "Only pending reservations..."}` |
| **PUT** | `/api/reservations/:id/status` | `manager` | `{ "status": "Confirmed" }` | **200** | `{"success": true, "message": "Success", "data": { ... }}` |
| **DELETE** | `/api/reservations/:id` | `admin` | *None* | **200** | `{"success": true, "message": "Success", "data": {}}` |

---

### Admin Dashboard Module

| Method | Endpoint | Role Required | Payload | Exp. Code | Exp. Response Schema |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **GET** | `/api/admin/dashboard` | `admin` | *None* | **200** | `{"success": true, "message": "Success", "data": { totalRevenue, totalOrders, ... }}` |
| **GET** | `/api/admin/dashboard` | `manager` | *None* | **403** | `{"success": false, "message": "Forbidden..."}` |
| **GET** | `/api/admin/stats` | `admin` | *None* | **200** | `{"success": true, "message": "Success", "data": [ { _id: "YYYY-MM-DD", revenue, ordersCount } ]}` |
| **GET** | `/api/admin/orders-summary` | `admin` | *None* | **200** | `{"success": true, "message": "Success", "data": { latestOrders, statusCounts, totalRevenue, averageOrderValue }}` |
| **GET** | `/api/admin/reservations-summary` | `admin` | *None* | **200** | `{"success": true, "message": "Success", "data": { latestReservations, statusCounts, totalReservations }}` |
