# Frontend Merge Map

This document maps all frontend source branch elements to their target destinations under `Burgerizza-Final/frontend/`.

## 1. Merging & Refactoring Classifications

| Source Location | Target Destination | Required Action | Reason |
| :--- | :--- | :--- | :--- |
| **`Feature-Customer/customer/`** | `frontend/customer/` | **Copy as-is** | Serves as the foundation for the public client web application. |
| **`Feature-manager-elhadedy/`** | `frontend/dashboard/` | **Copy as-is** | Serves as the foundation for the staff dashboard, including layouts, React Query setup, and theme. |
| **`Feature-Admin/src/pages/AdminDashboard.tsx`** | `frontend/dashboard/src/pages/dashboard/Dashboard.tsx` | **Merge** | Merge recharts metric graphs and statistics into the main dashboard page. |
| **`Feature-Admin/src/components/DailyStatsChart.tsx`** | `frontend/dashboard/src/components/charts/DailyStatsChart.tsx` | **Refactor** | Convert styles from Bootstrap 5 to Tailwind CSS v4, and replace custom Fetch client with Axios query hooks. |
| **`Feature-Admin/src/pages/AdminOrders.tsx`** | `frontend/dashboard/src/pages/orders/Orders.tsx` | **Discard** | The manager dashboard's `Orders.tsx` already has a superior Tailwind CSS and React Query implementation. |
| **`Feature-Admin/src/pages/AdminReservations.tsx`** | `frontend/dashboard/src/pages/reservations/Reservations.tsx` | **Discard** | The manager dashboard's `Reservations.tsx` already has a superior Tailwind CSS and React Query implementation. |
| **`Feature-Admin/src/api/`** | *N/A* | **Discard** | The manager dashboard has an Axios-based query system which is much more reliable. |
| **`Feature-Customer/customer/src/Shared/`** | `frontend/shared/` | **Refactor** | Port the shared layout types, brand assets, and formatters to `frontend/shared` so both sub-apps can read them. |

---

## 2. Refactoring Guides

### A. DailyStatsChart Refactoring
*   **Original style**: Bootstrap 5 classes (e.g. `p-4`, `h-100`, `text-center`, `spinner-border`).
*   **Target style**: Tailwind utility classes (e.g. `p-6`, `h-full`, `flex`, `items-center`, `justify-center`).
*   **Original API Client**: Native fetch wrapper:
    ```typescript
    const response = await getAdminStats();
    setStats(response.data);
    ```
*   **Target API Client**: React Query hook linked with manager Axios client:
    ```typescript
    const { data: stats } = useQuery({
      queryKey: ['admin-daily-stats'],
      queryFn: () => adminService.getStats(),
    });
    ```

### B. Shared Global Types (`frontend/shared/types/index.ts`)
*   Combine interface definitions for `User`, `MenuItem`, `Order`, `Reservation`, and `InventoryItem` from both branches.
*   Resolve structural differences (e.g., `User` has `phone`, `MenuItem` has `category` and `imageUrl`).
