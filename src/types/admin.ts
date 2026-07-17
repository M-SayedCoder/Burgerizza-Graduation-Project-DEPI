import type { OrderStatus } from "./order";

export interface AdminDashboardData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;

  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
}

export interface DailyStat {
  _id: string;
  revenue: number;
  ordersCount: number;
}

export interface PopulatedCustomer {
  _id: string;
  name: string;
  email: string;
}

export interface LatestOrder {
  _id: string;

  customer: PopulatedCustomer;

  items: {
    menuItem: string;
    quantity: number;
    price: number;
  }[];

  total: number;

  status: OrderStatus;

  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusCounts {
  Pending?: number;
  Confirmed?: number;
  Preparing?: number;
  Ready?: number;
  Delivered?: number;
  Cancelled?: number;
}

export interface OrdersSummary {
  latestOrders: LatestOrder[];

  statusCounts: OrderStatusCounts;

  totalRevenue: number;

  averageOrderValue: number;
}

export interface ReservationsSummary {
  latestReservations: unknown[];

  statusCounts: Record<string, number>;

  totalReservations: number;
}