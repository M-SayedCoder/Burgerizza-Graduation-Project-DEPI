import axiosInstance from './axios';
import { ApiResponse, Menu, PaginatedResponse } from '../types';

interface MenuFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}

// GET /api/menu
export const getMenu = (filters?: MenuFilters) =>
  axiosInstance.get<PaginatedResponse<Menu>>('/menu', { params: filters });

// GET /api/menu/:id
export const getMenuById = (id: string) =>
  axiosInstance.get<ApiResponse<Menu>>(`/menu/${id}`);

// POST /api/menu
export const createMenu = (data: FormData) =>
  axiosInstance.post<ApiResponse<Menu>>('/menu', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// PUT /api/menu/:id
export const updateMenu = (id: string, data: FormData) =>
  axiosInstance.put<ApiResponse<Menu>>(`/menu/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// DELETE /api/menu/:id
export const deleteMenu = (id: string) =>
  axiosInstance.delete<ApiResponse<null>>(`/menu/${id}`);

// PATCH /api/menu/:id/toggle
export const toggleAvailability = (id: string) =>
  axiosInstance.patch<ApiResponse<Menu>>(`/menu/${id}/toggle`);
