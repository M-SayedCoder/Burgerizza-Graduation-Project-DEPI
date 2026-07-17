import { Reservation, PaginatedResponse, ApiResponse } from '../types';
import { ReservationStatus } from '../constants';
import { mockReservations } from './mockData';
import { MOCK, delay } from './config';
import * as reservationApi from '../api/reservationApi';

let _reservations = [...mockReservations];

interface ReservationFilters { page?: number; limit?: number; status?: string; }

export const reservationService = {
  async getAll(filters: ReservationFilters = {}): Promise<PaginatedResponse<Reservation>> {
    if (!MOCK.reservations) return reservationApi.getReservations(filters).then((r) => r.data);

    await delay();
    let data = [..._reservations];

    if (filters.status) data = data.filter((r) => r.status === filters.status);
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const total = data.length;
    data = data.slice((page - 1) * limit, page * limit);

    return { success: true, data, total, page, pages: Math.ceil(total / limit) };
  },

  async updateStatus(id: string, status: ReservationStatus): Promise<ApiResponse<Reservation>> {
    if (!MOCK.reservations) return reservationApi.updateReservation(id, status).then((r) => r.data);
    await delay(400);
    _reservations = _reservations.map((r) => r._id === id ? { ...r, status } : r);
    const updated = _reservations.find((r) => r._id === id)!;
    return { success: true, message: 'Reservation updated', data: updated };
  },
};
