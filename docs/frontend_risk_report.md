# Frontend Risk & API Contract Report

This report outlines integration risks, mock API mappings, and verified backend endpoint contracts.

## 1. Mock APIs Replacement Plan

During Task 3.4, mock logic will be swapped out for real Axios HTTP requests. The following files contain mock data structures that must be removed:

1.  **`customer/src/services/authService.ts`**:
    *   *Mocked*: User profile data, login token creation (`mock-jwt-token`), and register user returns.
    *   *Replacement*: Wire `axiosInstance.post('/auth/login')`, save JWT token to `localStorage`, and load details via `axiosInstance.get('/auth/me')`.
2.  **`customer/src/services/menuService.ts`**:
    *   *Mocked*: Hardcoded food array (`MOCK_MENU_ITEMS`) and Category list (`MOCK_CATEGORIES`).
    *   *Replacement*: Wire `axiosInstance.get('/menu')` and filter categories locally.
3.  **`customer/src/services/orderService.ts`**:
    *   *Mocked*: List and place order payloads.
    *   *Replacement*: Wire `axiosInstance.post('/orders')` sending structured `{ items }` arrays.
4.  **`customer/src/services/reservationService.ts`**:
    *   *Mocked*: Book table form actions.
    *   *Replacement*: Wire `axiosInstance.post('/reservations')` with `{ date, time, partySize, notes }`.
5.  **`dashboard/src/services/config.ts`**:
    *   *Mocked*: `MOCK` flags control toggling mock data.
    *   *Replacement*: Turn `MOCK.menu = false`, `MOCK.orders = false`, `MOCK.reservations = false`, and `MOCK.inventory = false` to enable live traffic.

---

## 2. API Contract Mismatches & Solutions

The unified backend routes have been fully verified. The following mismatches between frontend assumptions and backend contracts must be resolved:

### A. Route Path Prefix Mismatch
*   **Frontend Assumption**: Points to `/auth/login`, `/menu`, `/orders`, `/reservations`.
*   **Backend Contract**: All API endpoints are mounted under `/api/`.
*   *Solution*: Set `apiBaseUrl` in the customer Axios config, and `BASE_URL` in the manager Axios config, to `/api` (e.g. `http://localhost:5000/api`).

### B. Category Listing Endpoint Absence
*   **Frontend Assumption**: Customer frontend calls `GET /categories` to populate category badges.
*   **Backend Contract**: No category model or endpoint exists. The categories are hardcoded or filtered on `/api/menu`.
*   *Solution*: Load categories locally from a constants file (`['Burger', 'Sides', 'Drinks']`) to avoid querying an unmapped API endpoint.

### C. Category Name Drifts
*   **Frontend Categories**: `['All', 'Burger', 'Pizza', 'Pasta', 'Hot Dog']`
*   **Backend Seed Categories**: `['Burger', 'Sides', 'Drinks']`
*   *Solution*: Align frontend category lists and menus to match the backend seeded items.

### D. User Profile Paths
*   **Frontend Assumption**: Customer profile edits call `PUT /profile` and `GET /profile`.
*   **Backend Contract**: Profile details are managed through the `/api/auth/me` endpoint.
*   *Solution*: Map profile updates to the user settings endpoint.

---

## 3. Integration Risks & Mitigations

### Risk 1: Styling reset clashes (Tailwind v4 vs Bootstrap 5)
*   *Severity*: High (would render layouts broken).
*   *Mitigation*: Absolute isolation. Do not import Bootstrap styles in the dashboard or Tailwind styles in the customer app. Keep their bundlers decoupled.

### Risk 2: Image asset paths
*   *Severity*: Medium.
*   *Mitigation*: The unified backend must serve seeded food images from a static folder (e.g., `uploads/`). Update Vite config proxy settings to redirect `/uploads/*` requests to the Node.js server.
