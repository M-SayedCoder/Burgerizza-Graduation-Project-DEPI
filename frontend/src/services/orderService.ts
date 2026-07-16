import { Order, PaginatedResponse, ApiResponse } from '../types';
import { OrderStatus } from '../constants';
import { mockOrders } from './mockData';
import { MOCK, delay } from './config';
import * as orderApi from '../api/orderApi';

let _orders = [...mockOrders];

interface OrderFilters { page?: number; limit?: number; search?: string; status?: string; sort?: string; }

export const orderService = {
  async getAll(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    if (!MOCK.orders) return orderApi.getOrders(filters).then((r) => r.data);

    await delay();
    let data = [..._orders];

    if (filters.status) data = data.filter((o) => o.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((o) =>
        o.customer?.name?.toLowerCase().includes(q) ||
        o._id.toLowerCase().includes(q)
      );
    }
    if (filters.sort === '-createdAt' || !filters.sort) data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const total = data.length;
    data = data.slice((page - 1) * limit, page * limit);

    return { success: true, data, total, page, pages: Math.ceil(total / limit) };
  },

  async getById(id: string): Promise<ApiResponse<Order>> {
    if (!MOCK.orders) return orderApi.getOrderById(id).then((r) => r.data);
    await delay(200);
    const order = _orders.find((o) => o._id === id);
    if (!order) throw new Error('Order not found');
    return { success: true, message: 'Success', data: order };
  },

  async updateStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    if (!MOCK.orders) return orderApi.updateOrderStatus(id, status).then((r) => r.data);
    await delay(400);
    _orders = _orders.map((o) => o._id === id ? { ...o, status } : o);
    const updated = _orders.find((o) => o._id === id)!;
    return { success: true, message: 'Status updated', data: updated };
  },
};
