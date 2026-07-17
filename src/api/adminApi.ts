import { apiRequest } from "./apiClient";

import type {
  AdminDashboardData,
  DailyStat,
  OrdersSummary,
  ReservationsSummary,
} from "../types/admin";

export function getAdminDashboard() {
  return apiRequest<AdminDashboardData>(
    "/api/admin/dashboard"
  );
}

export function getAdminStats() {
  return apiRequest<DailyStat[]>(
    "/api/admin/stats"
  );
}

export function getOrdersSummary() {
  return apiRequest<OrdersSummary>(
    "/api/admin/orders-summary"
  );
}

export function getReservationsSummary() {
  return apiRequest<ReservationsSummary>(
    "/api/admin/reservations-summary"
  );
}