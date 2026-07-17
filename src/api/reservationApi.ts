import axiosInstance from './axios';
import { ApiResponse, Reservation, PaginatedResponse } from '../types';
import { ReservationStatus } from '../constants';

// GET /api/reservations
export const getReservations = (filters?: { page?: number; limit?: number; status?: string }) =>
  axiosInstance.get<PaginatedResponse<Reservation>>('/reservations', { params: filters });

// PUT /api/reservations/:id
export const updateReservation = (id: string, status: ReservationStatus) =>
  axiosInstance.put<ApiResponse<Reservation>>(`/reservations/${id}`, { status });
