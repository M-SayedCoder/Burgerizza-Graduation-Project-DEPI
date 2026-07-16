import axiosInstance from './axios';
import { ApiResponse, Order, PaginatedResponse } from '../types';
import { OrderStatus } from '../constants';

interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

// GET /api/orders
export const getOrders = (filters?: OrderFilters) =>
  axiosInstance.get<PaginatedResponse<Order>>('/orders', { params: filters });

// GET /api/orders/:id
export const getOrderById = (id: string) =>
  axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);

// PUT /api/orders/:id/status
export const updateOrderStatus = (id: string, status: OrderStatus) =>
  axiosInstance.put<ApiResponse<Order>>(`/orders/${id}/status`, { status });
