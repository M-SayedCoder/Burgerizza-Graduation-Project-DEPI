import axiosInstance from './axios';
import { apiRequest } from "./apiClient";

import type {
  AdminDashboardData,
  DailyStat,
  OrdersSummary,
  ReservationsSummary,
} from "../types/admin";

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  totalReservations: number;
  todayReservations: number;
  pendingReservations: number;
}

export interface OrdersSummaryItem {
  status: string;
  count: number;
  revenue: number;
}

export interface ReservationsSummaryItem {
  status: string;
  count: number;
}

// ==================== Manager/Staff Endpoints (Axios) ====================

// GET /api/admin/dashboard
export const getDashboard = () =>
  axiosInstance.get<{ success: boolean; data: DashboardStats }>('/admin/dashboard');

// GET /api/admin/stats
export const getStats = () =>
  axiosInstance.get<{ success: boolean; data: DashboardStats }>('/admin/stats');

// GET /api/admin/orders-summary
export const getManagerOrdersSummary = () =>
  axiosInstance.get<{ success: boolean; data: OrdersSummaryItem[] }>('/admin/orders-summary');

// GET /api/admin/reservations-summary
export const getManagerReservationsSummary = () =>
  axiosInstance.get<{ success: boolean; data: ReservationsSummaryItem[] }>('/admin/reservations-summary');


// ==================== Admin Endpoints (Fetch) ====================

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
