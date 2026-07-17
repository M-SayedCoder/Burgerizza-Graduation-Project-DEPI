# 🍔 Burgerizza — Manager & Admin Dashboard

The internal management console for the **Burgerizza** restaurant platform. This is the operational side of the system — where **managers** and **admins** run the day-to-day business: processing orders, managing the menu, handling reservations, tracking inventory, and monitoring performance.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery)
![Status](https://img.shields.io/badge/Status-Graduation_Project-success)

---

## 📖 Overview

The Manager Dashboard is a role-gated, single-page application built for restaurant staff — **not** customers. It consumes the same backend as the customer storefront but is scoped to `manager` and `admin` roles only, giving staff full control over menu content, live order flow, table reservations, stock levels, and business analytics from one interface.

---

## ✨ Features

### 📊 Dashboard
- At-a-glance KPIs: total orders, revenue, pending orders, reservations
- Daily revenue & order-count chart (last 7 days) via Recharts

### 🍔 Menu Management
- Full CRUD on menu items (name, description, price, category, image)
- Image upload
- Toggle item availability without deleting it

### 📦 Order Management
- Live order list with status filtering
- Order detail view per order
- Status pipeline updates: `Pending → Confirmed → Preparing → Ready → Delivered` (or `Cancelled`)

### 📅 Reservation Management
- View incoming table reservations
- Approve, reject, or update reservation status
- Filter by date and status

### 📋 Inventory Tracking
- Stock levels per ingredient/item with unit tracking (kg, g, litre, piece, etc.)
- Low-stock alerts based on a configurable minimum threshold
- Soft-delete and restore for inventory items

### 🔔 Notifications
- In-app notification panel for new orders, reservations, and system alerts
- Mark as read / clear all

### 👤 Auth & Profile
- JWT-based login, scoped to `manager` and `admin` roles
- Profile view within the dashboard shell

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server State | TanStack Query (React Query) |
| Forms & Validation | React Hook Form + Zod |
| Charts | Recharts |
| HTTP Client | Axios (with request/response interceptors) |
| Alerts / Dialogs | SweetAlert2 + React Hot Toast |
| Linting | oxlint |

---

## 📂 Project Structure

```text
dashboard/
├── src/
│   ├── api/              # Axios call wrappers, one file per resource
│   │   ├── authApi.ts
│   │   ├── menuApi.ts
│   │   ├── orderApi.ts
│   │   ├── reservationApi.ts
│   │   ├── inventoryApi.ts
│   │   ├── adminApi.ts
│   │   ├── notificationApi.ts
│   │   └── axios.ts       # Axios instance, JWT interceptor, 401 handling
│   │
│   ├── services/          # Business-facing service layer + mock-data toggles
│   ├── pages/
│   │   ├── auth/           # Login
│   │   ├── dashboard/       # KPIs & analytics
│   │   ├── menu/            # Menu list & management
│   │   ├── orders/          # Orders list & order details
│   │   ├── reservations/    # Reservations management
│   │   └── inventory/       # Stock tracking
│   │
│   ├── components/
│   │   ├── common/         # Navbar, Sidebar, Modal, Loader, NotificationsPanel...
│   │   ├── dashboard/       # DailyStatsChart, etc.
│   │   ├── forms/           # MenuForm, etc.
│   │   └── tables/          # OrdersTable, MenuTable, ReservationTable
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx     # Route map
│   │   └── ProtectedRoute.tsx # Role-gated route guard
│   │
│   ├── layouts/            # DashboardLayout (sidebar + navbar shell)
│   ├── context/             # AuthContext
│   ├── hooks/
│   ├── constants/
│   └── types/
│
├── public/
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔐 Access Control

This app is restricted to two roles:

| Role | Access |
|---|---|
| `manager` | Menu, orders, reservations, inventory (view), dashboard |
| `admin` | Everything a manager has, plus inventory create/edit/delete/restore and full admin analytics |

Unauthenticated users are redirected to `/login`. Route-level guarding is handled by `ProtectedRoute.tsx`, and the JWT is attached to every request automatically via an Axios interceptor.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- The Burgerizza backend running locally (see backend README) on `http://localhost:5000`

### Installation

```bash
cd frontend/dashboard
npm install
```

### Run in development

```bash
npm run dev
```

The app runs on **`http://localhost:5174`**. API calls to `/api` and static files under `/uploads` are proxied to the backend at `http://localhost:5000` (configured in `vite.config.ts`), so no separate `.env` base URL is required for local development.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 📡 Backend Integration

- All requests go through a shared Axios instance (`src/api/axios.ts`) that:
  - Attaches the JWT from `localStorage` (`manager_token`) to every request
  - Automatically logs the user out and redirects to `/login` on a `401` response
- Every resource (`auth`, `menu`, `orders`, `reservations`, `inventory`, `admin`, `notifications`) has its own API wrapper under `src/api/`, and a corresponding service in `src/services/` with a mock-data toggle (`src/services/config.ts`) used during frontend development before the backend endpoint was ready. All modules are currently wired to the real backend.
- Server responses follow a consistent shape: `{ success, message, data }` for single results, with `total` / `page` / `pages` added for paginated lists, and `{ success: false, message }` (or a field-level `errors[]` array) for failures.

---

## 🧭 Roadmap

- Real-time order/notification updates via WebSockets
- Advanced analytics (predictive insights, best-seller trends)
- CSV/PDF export for reports
- Dark mode

---

<div align="center">

**Burgerizza — Manager & Admin Dashboard**
Part of the Burgerizza Restaurant Management & Online Ordering System · DEPI Graduation Project 2026

</div>
