# Integration Plan: Burgerizza Project Integration

This document maps out the detailed integration plan to merge the local Burgerizza branch folders into a unified, production-ready system under `Burgerizza-Final`.

---

## 1. Backend Integration Map (mohamed-backend vs shehab-branch)

### A. Core File Comparison & Conflict Resolution

#### 1. Models: `User.js`
*   **mohamed-backend**: Simple fields, uses `password` (hashed or plain) and has no phone field.
*   **shehab-branch**: Uses `passwordHash` with `{ select: false }` for query safety, a phone field, and overrides `.toJSON()` to sanitize outgoing user payloads.
*   **Resolution**: **Keep Shehab's version**. It is much more secure and provides the necessary phone field for customer profiles.
*   **Required Changes**:
    *   Update Mohamed's `utils/seed.js` and controllers to use `passwordHash` instead of `password`.
    *   Update seed script to supply the mandatory phone field for mock customers.

#### 2. Models: `MenuItem.js`
*   **mohamed-backend**: Simple schema with only `name`, `price`, `description`, and `isAvailable`.
*   **shehab-branch**: Richer schema including `category` (required) and `imageUrl`.
*   **Resolution**: **Keep Shehab's version**. These additional fields are required for the customer menu layout and the manager editing form.
*   **Required Changes**:
    *   Update Mohamed's seeding script to supply sample `category` values and `imageUrl` paths.

#### 3. Middleware: `auth.js`
*   **mohamed-backend**: Basic JWT decoding that extracts `role` directly from the token, plus `bypassAuth` to mock logins in non-production.
*   **shehab-branch**: Decodes JWT, queries MongoDB (`User.findById`) to attach the full user object to `req.user`, handles token expiration, and provides a custom `authorize` helper.
*   **Resolution**: **Merge both**.
    *   Use Shehab's `protect` middleware as the default authenticator.
    *   Modify `authController.js` in shehab-branch to sign `role` into the JWT payload.
    *   Deprecate `bypassAuth` to eliminate development backdoor security risks.
*   **Required Changes**: Rewrite the final `middlewares/auth.js` to combine user extraction, role checks, and standard error handling.

#### 4. Validators
*   **mohamed-backend**: Custom inline JavaScript validation code (returning English error strings).
*   **shehab-branch**: Uses `express-validator` library (returning Arabic error strings).
*   **Resolution**: **Use `express-validator`**. It is declarative, cleaner, and standard for Node/Express.
*   **Required Changes**:
    *   Translate Arabic error messages to English for global API uniformity, or implement internationalization headers if bilingual errors are required.
    *   Rewrite Mohamed's order, reservation, and inventory validators in `express-validator` syntax.

#### 5. Utils: `responseHandler.js`
*   **mohamed-backend**: `sendError(res, message, errors = null, statusCode = 500)`
*   **shehab-branch**: `sendError(res, message, statusCode = 400, errors = null)`
*   **Conflict**: The parameter order of `errors` and `statusCode` is reversed.
*   **Resolution**: **Keep Mohamed's signature**. Standardizing status code at the end is standard practice.
*   **Required Changes**: Refactor Shehab's `authController.js` and `menuController.js` to pass arguments matching the standardized signature.

#### 6. Root Configuration: `package.json`
*   **mohamed-backend**: Uses older dependencies, includes Swagger and nyc.
*   **shehab-branch**: Uses newer dependencies (Express 5, mongoose 8.15), helmet, Jest, and supertest.
*   **Resolution**: **Merge dependencies**. Use shehab-branch's newer library baselines and add missing dependencies from mohamed-backend (`swagger-ui-express`, `cors`).
*   **Required Changes**: Write a consolidated `package.json` for `Burgerizza-Final/backend`.

---

## 2. Frontend Mapping

### A. Component and Service Map

| Module Branch | Styling & Framework | State & API Fetching | Routing | Reusable Components |
| :--- | :--- | :--- | :--- | :--- |
| **`Feature-Admin`** | Bootstrap 5, Bootstrap Icons | Local state, native `fetch` | React Router v7 | `DailyStatsChart`, `RecentOrders` table |
| **`Feature-Customer`** | Bootstrap 5, custom CSS, Framer Motion | Redux Toolkit, Axios | React Router v7 (Data API) | `Badge`, `Button`, `Spinner`, `Card` |
| **`Feature-manager-elhadedy`** | Tailwind CSS v4, React Icons | React Query, Axios, AuthContext | React Router v7 | `ConfirmDialog`, `Loader`, `Modal`, `Sidebar` |

### B. Dependency & Styling Conflicts

> [!WARNING]
> Tailwind CSS v4 resets (`Preflight`) and Bootstrap 5 styles clash when compiled in a single HTML root. This will break Bootstrap's layout grids and button classes.

*   **Resolution**: Unify the codebase into a monorepo workspace containing **two distinct frontend applications**:
    1.  `frontend/customer`: Pure Bootstrap 5 + Redux site.
    2.  `frontend/dashboard`: Tailwind CSS v4 + React Query site. This dashboard will serve **both** managers and admins (using role checks to show/hide admin actions).

---

## 3. Database & API Compatibility Report

### A. MongoDB Models Comparison

| Model | Status | Field Adjustments Needed |
| :--- | :--- | :--- |
| **`User`** | Unified | Rename `password` field queries to `passwordHash`. |
| **`MenuItem`** | Unified | Add required `category` and `imageUrl` fields. |
| **`Order`** | New | No changes needed. Reference `User` and `MenuItem` models. |
| **`Reservation`**| New | No changes needed. Reference `User` model. |
| **`Inventory`** | New | Change `minimumStock` to `minQuantity` and add `costPerUnit` to match frontend schema. |
| **`Notification`**| Missing | **Create new model**: `title`, `message`, `type`, `isRead`, `link`, `createdAt`. |

### B. Payload & Endpoint Mismatches

1.  **Pagination Shape Mismatch**:
    *   Backend returns: `{ data: { orders: [...], pagination: { total, page, ... } } }`.
    *   Dashboard Frontend expects: `{ data: T[], total, page, pages }`.
    *   **Fix**: Update backend pagination helper to format data directly in the root array.
2.  **Stats Aggregation Mismatch**:
    *   Backend `/api/admin/stats` returns a daily history array.
    *   Frontend `adminService.getStats()` expects a unified dashboard stats object.
    *   **Fix**: Update backend `getStats` or add a mapper in `adminService.ts` to fetch both overall numbers and daily history.
3.  **Role In Token**:
    *   Backend auth middleware relies on token `decoded.role`.
    *   Shehab's `authController` does not sign `role` in JWT.
    *   **Fix**: Add `role` to the payload of `jwt.sign()` in `authController.js`.

---

## 4. Testing Audit

*   **Existing Tests**:
    *   `shehab-branch/Burgerizza-Backend/tests`: Jest and Supertest configurations (`auth.test.js`, `menu.test.js`).
    *   `mohamed-backend/backend/tests`: Custom verification runner making live `fetch` requests with mocked auth headers.
*   **Missing Scenarios Needed for Defense**:
    *   **Authorization Escapes**: Testing that a role-restricted endpoint (e.g. `DELETE /api/orders`) rejects customer tokens with `403`.
    *   **Integrity checks**: Testing order creation failure if items are unavailable.
    *   **Empty inputs**: Validation failures on malformed JSON bodies.

---

## 5. Step-by-Step Integration Plan

### Phase 1: Create Consolidated Folders
1.  Initialize clean directories:
    ```
    Burgerizza-Final/
    ├── backend/
    ├── frontend/
    │   ├── customer/
    │   └── dashboard/
    └── tests/
    ```

### Phase 2: Backend Consolidation
1.  Copy all shared controllers, models, and routes into `backend/`.
2.  Apply model overrides:
    *   Keep Shehab's `User.js` and `MenuItem.js`.
    *   Copy Mohamed's `Order.js`, `Reservation.js`, and `Inventory.js`. Modify `Inventory.js` schema properties to include `costPerUnit` and rename `minimumStock` to `minQuantity`.
    *   Add new `Notification.js` model.
3.  Rewrite `middlewares/auth.js` to securely load roles and delete `bypassAuth`.
4.  Modify `controllers/authController.js` to sign user `role` into JWT.
5.  Refactor response handler error signatures across auth/menu controllers.
6.  Mount all routers inside `app.js` and configure Static serving for uploaded meal images.

### Phase 3: Frontend Consolidation
1.  Copy `Feature-Customer/customer` folder content into `frontend/customer`.
2.  Copy `Feature-manager-elhadedy` folder content into `frontend/dashboard`.
3.  Migrate Admin components from `Feature-Admin` (e.g. `DailyStatsChart`, `RecentOrders`) into `frontend/dashboard` under `/pages/admin`.
4.  Update dashboard routing config (`AppRoutes.tsx`) to guard Admin pages using role verification.
5.  Turn off `MOCK` configurations in `frontend/dashboard/src/services/config.ts` to start live integration testing.

### Phase 4: Verification
1.  Unify tests in `tests/` using Jest and Supertest.
2.  Execute test runner: `npm run test`.
3.  Run production build check: `npm run build` on both customer and dashboard apps to confirm type safety.
