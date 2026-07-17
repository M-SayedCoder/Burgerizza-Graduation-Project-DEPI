# Frontend Dependency Report

This report compares the dependencies of the three source frontend branches and details the package resolution for the unified target sub-apps.

## 1. Source Dependency Comparison

| Package | Feature-Customer | Feature-manager-elhadedy | Feature-Admin | Unified Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **React** | `^19.2.7` | `^19.2.7` | `^19.2.7` | `^19.2.7` (React 19) |
| **React-DOM** | `^19.2.7` | `^19.2.7` | `^19.2.7` | `^19.2.7` (React 19) |
| **React Router DOM** | `^7.18.1` | `^7.18.1` | `^7.18.1` | `^7.18.1` (React Router 7) |
| **Axios** | `^1.18.1` | `^1.18.1` | *N/A (Uses native fetch)* | `^1.18.1` |
| **CSS Framework** | `bootstrap ^5.3.8` | `tailwindcss ^4.3.2` | `bootstrap ^5.3.8` | Isolated in sub-apps |
| **State Management** | `@reduxjs/toolkit` | `@tanstack/react-query` | *N/A (Local useState)* | Isolated in sub-apps |
| **Forms & Validation** | `react-hook-form` / `zod` | `react-hook-form` / `zod` | *N/A (Custom state)* | Isolated in sub-apps |
| **Icons** | `react-icons ^5.7.0` | `react-icons ^5.7.0` | `bootstrap-icons` | Isolated in sub-apps |

---

## 2. Package Resolution Strategy

To maintain sub-app isolation, each app will maintain its own `package.json` file. This resolves version clashes and keeps bundle sizes lean.

### A. Customer App Package Resolution (`frontend/customer/package.json`)
The customer app requires **Bootstrap 5** for its responsive public layouts, **Framer Motion** for animations, and **Redux Toolkit** for local cart caching.

```json
{
  "name": "burgerizza-customer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@hookform/resolvers": "^5.4.0",
    "@reduxjs/toolkit": "^2.12.0",
    "axios": "^1.18.1",
    "bootstrap": "^5.3.8",
    "framer-motion": "^12.42.2",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-hook-form": "^7.81.0",
    "react-icons": "^5.7.0",
    "react-redux": "^9.3.0",
    "react-router-dom": "^7.18.1",
    "zod": "^4.4.3"
  }
}
```

### B. Dashboard App Package Resolution (`frontend/dashboard/package.json`)
The staff dashboard uses **Tailwind CSS v4** (with Vite compiler integration), **React Query** for async state sync, **Recharts** for reports, and **SweetAlert2** / **React Hot Toast** for instant alerts.

```json
{
  "name": "burgerizza-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@hookform/resolvers": "^5.4.0",
    "@tanstack/react-query": "^5.101.2",
    "axios": "^1.18.1",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-hook-form": "^7.80.0",
    "react-hot-toast": "^2.6.0",
    "react-icons": "^5.7.0",
    "react-router-dom": "^7.18.1",
    "recharts": "^3.9.2",
    "sweetalert2": "^11.26.25",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.2",
    "tailwindcss": "^4.3.2"
  }
}
```

---

## 3. Package Conflict Resolution & Upgrades
*   **Tailwind CSS v4 & @tailwindcss/vite**: Uses the new compiler engine which runs directly in Vite without requiring a separate `postcss.config.js` or `tailwind.config.js`. This is extremely clean and fast.
*   **React 19 Compatibility**: Recharts (`^3.9.2`), Framer Motion (`^12.42.2`), and React Router (`^7.18.1`) are fully certified to run under React 19. No `--legacy-peer-deps` flags will be required.
