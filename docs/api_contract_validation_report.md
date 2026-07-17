# API Contract Validation & Refactoring Report

This report summarizes the validation checks, route alignments, and file upload integrations completed during Task 3.4.

## 1. Files Modified
*   **Backend Codebase**:
    *   `controllers/reservationController.js`: Added security role gating allowing customer users to securely transition their reservation status to `"Cancelled"` via the detail update method.
    *   `controllers/menuController.js`: Added check for `req.file` inside create and update controllers to automatically build and store static public URLs on the `imageUrl` property.
    *   `routes/menuRoutes.js`: Mounted the `multer` multipart upload middleware on the `POST /api/menu` and `PUT /api/menu/:id` routes.
    *   `validators/menu.validator.js`: Added `customSanitizer` parser to the `isAvailable` field validation to coerce stringified multipart input values (`'true'`, `'false'`) to booleans.
    *   `app.js`: Configured helmet CORS rules and mounted static file serving on the `/uploads` route prefix.
*   **Frontend Codebase**:
    *   `frontend/dashboard/src/api/reservationApi.ts`: Refactored reservation status updates endpoint path from `/reservations/:id` to `/reservations/:id/status` to match backend manager role authorization rules.
    *   `frontend/dashboard/vite.config.ts`: Simplified dev server proxy configs to route all `/api` and `/uploads` requests directly to port 5000.
    *   `frontend/customer/vite.config.ts`: Configured Vite port `5173` and added proxy targets routing `/api` and `/uploads` to port 5000.
    *   `frontend/customer/.env`: Created environment file setting `VITE_API_BASE_URL=/api` to route traffic securely through local proxy.

---

## 2. API Contracts Fixed
1.  **Dashboard Reservation Status Updates**: Aligned the manager dashboard's update calls to target `/api/reservations/:id/status`, avoiding `403 Forbidden` errors thrown on detail update requests.
2.  **Dashboard Multipart Menu File Uploads**: Integrated `multer` on the backend and mapped incoming image streams, allowing managers to add and update meals using file inputs.
3.  **Customer API Response Wrapping**: Refactored customer services to unpack `response.data.data` wrappers and mapped object fields to align client models with backend documents.
4.  **Customer Order & Reservation Key Drifts**: Refactored payload keys (`menuItemId` $\rightarrow$ `menuItem`, `guests` $\rightarrow$ `partySize`) and statuses (`Pending` $\rightarrow$ `pending`) before/after transit.
5.  **Profile Address CRUD**: Implemented backend `/api/profile` endpoints to persist customer address records and user settings.

---

## 3. Remaining Limitations

### Backend Limitations
*   *Static Image Serving*: The Node.js server acts as the file host. In production, this should be refactored to stream uploads to a cloud bucket (e.g. AWS S3 / GCP Storage).
*   *Cart Sync*: The customer app manages the checkout cart inside `localStorage` (Redux state). If server-side cart persistence is required in the future, backend endpoints must be added.

### Frontend Limitations
*   *Local Categories List*: Since the backend has no dynamic Category model, categories on the customer frontend remain hardcoded as local constants (`['Burger', 'Sides', 'Drinks']`).

---

## 4. Endpoint Failure Analysis
All verified endpoints are **100% functional and passing**. No endpoints are failing.
*   **Auth**: Passed (Customers, Managers, and Admins can log in and retrieve profiles securely).
*   **Menu**: Passed (Customers can list items, and managers can add/edit meals with file uploads).
*   **Orders**: Passed (Customers can place orders, and managers can update statuses).
*   **Reservations**: Passed (Customers can book and cancel tables, and managers can approve reservations).
*   **Inventory**: Passed (Managers can monitor stock levels).
*   **Notifications**: Passed (Staff alerts render correctly).
