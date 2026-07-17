import axiosInstance from './axios';
import { InventoryItem, InventoryFormPayload } from '../types/inventory';
import { ApiResponse, PaginatedResponse } from '../types';

export interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;          // search by name or supplier
  category?: string;
  isActive?: boolean;
  sortBy?: string;          // name, quantity, costPerUnit
  order?: 'asc' | 'desc';
}

// GET /api/inventory
export const getInventory = (filters?: InventoryFilters) =>
  axiosInstance.get<PaginatedResponse<InventoryItem>>('/inventory', { params: filters });

// GET /api/inventory/low-stock
export const getLowStock = () =>
  axiosInstance.get<ApiResponse<InventoryItem[]>>('/inventory/low-stock');

// GET /api/inventory/:id
export const getInventoryById = (id: string) =>
  axiosInstance.get<ApiResponse<InventoryItem>>(`/inventory/${id}`);

// POST /api/inventory
export const createInventoryItem = (data: InventoryFormPayload) =>
  axiosInstance.post<ApiResponse<InventoryItem>>('/inventory', data);

// PUT /api/inventory/:id
export const updateInventoryItem = (id: string, data: Partial<InventoryFormPayload>) =>
  axiosInstance.put<ApiResponse<InventoryItem>>(`/inventory/${id}`, data);

// DELETE /api/inventory/:id  (soft delete — sets isActive: false)
export const deleteInventoryItem = (id: string) =>
  axiosInstance.delete<ApiResponse<null>>(`/inventory/${id}`);

// PATCH /api/inventory/:id/restore
export const restoreInventoryItem = (id: string) =>
  axiosInstance.patch<ApiResponse<InventoryItem>>(`/inventory/${id}/restore`);
