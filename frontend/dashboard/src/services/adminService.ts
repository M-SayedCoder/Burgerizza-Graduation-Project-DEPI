import { MOCK, delay } from './config';
import * as adminApi from '../api/adminApi';
import type { DashboardStats, OrdersSummaryItem, ReservationsSummaryItem } from '../api/adminApi';
import type { DailyStat } from '../types';

export type { DashboardStats, OrdersSummaryItem, ReservationsSummaryItem };

const _mockStats: DashboardStats = {
  totalOrders: 248,
  pendingOrders: 12,
  completedOrders: 198,
  totalRevenue: 89450,
  todayOrders: 18,
  todayRevenue: 5320,
  totalReservations: 67,
  todayReservations: 8,
  pendingReservations: 3,
};

export const adminService = {
  async getStats(): Promise<DashboardStats> {
    if (!MOCK.admin) {
      const res = await adminApi.getDashboard();
      return res.data.data;
    }
    await delay(400);
    return { ..._mockStats };
  },

  async getDailyStats(): Promise<DailyStat[]> {
    if (!MOCK.admin) {
      const res = await adminApi.getStats();
      return res.data.data as unknown as DailyStat[];
    }
    await delay(300);
    const mockDaily: DailyStat[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      mockDaily.push({
        _id: date.toISOString().split('T')[0],
        revenue: 1000 + Math.floor(Math.random() * 5000),
        ordersCount: 5 + Math.floor(Math.random() * 20),
      });
    }
    return mockDaily;
  },

  async getOrdersSummary(): Promise<OrdersSummaryItem[]> {
    if (!MOCK.admin) return adminApi.getOrdersSummary().then((r) => r.data.data);
    await delay(300);
    return [
      { status: 'Pending',   count: 12,  revenue: 0     },
      { status: 'Preparing', count: 23,  revenue: 0     },
      { status: 'Delivered', count: 198, revenue: 89450 },
      { status: 'Cancelled', count: 15,  revenue: 0     },
    ];
  },

  async getReservationsSummary(): Promise<ReservationsSummaryItem[]> {
    if (!MOCK.admin) return adminApi.getReservationsSummary().then((r) => r.data.data);
    await delay(300);
    return [
      { status: 'Confirmed', count: 45 },
      { status: 'Pending',   count: 12 },
      { status: 'Rejected',  count: 10 },
    ];
  },
};
