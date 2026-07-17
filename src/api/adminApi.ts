import axiosInstance from './axios';

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

// GET /api/admin/dashboard
export const getDashboard = () =>
  axiosInstance.get<{ success: boolean; data: DashboardStats }>('/admin/dashboard');

// GET /api/admin/stats
export const getStats = () =>
  axiosInstance.get<{ success: boolean; data: DashboardStats }>('/admin/stats');

// GET /api/admin/orders-summary
export const getOrdersSummary = () =>
  axiosInstance.get<{ success: boolean; data: OrdersSummaryItem[] }>('/admin/orders-summary');

// GET /api/admin/reservations-summary
export const getReservationsSummary = () =>
  axiosInstance.get<{ success: boolean; data: ReservationsSummaryItem[] }>('/admin/reservations-summary');
