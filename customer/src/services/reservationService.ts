import type { Reservation, BookTableRequest } from '../types/reservation.types';

// ─── Mock Data ────────────────────────────────────────────────────

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'RES-001',
    userId: '1',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '19:00',
    guests: 4,
    name: 'Mohamed Sayed',
    phone: '01050336677',
    notes: 'Window seat preferred',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];

// ─── Reservation Service ──────────────────────────────────────────

export const reservationService = {
  /**
   * Get all reservations for the authenticated user
   * TODO: Replace with real API call → GET /reservations
   */
  getReservations: async (): Promise<Reservation[]> => {
    await new Promise((r) => setTimeout(r, 400));
    // Real: const response = await axiosInstance.get<Reservation[]>(API_ENDPOINTS.RESERVATIONS.LIST);
    // return response.data;
    return [...MOCK_RESERVATIONS];
  },

  /**
   * Book a table
   * TODO: Replace with real API call → POST /reservations
   */
  bookTable: async (data: BookTableRequest): Promise<Reservation> => {
    await new Promise((r) => setTimeout(r, 700));
    const reservation: Reservation = {
      id: 'RES-' + Date.now(),
      userId: '1',
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    // Real: const response = await axiosInstance.post<Reservation>(API_ENDPOINTS.RESERVATIONS.BOOK, data);
    // return response.data;
    return reservation;
  },

  /**
   * Cancel a reservation
   * TODO: Replace with real API call → POST /reservations/:id/cancel
   */
  cancelReservation: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 400));
    console.log('[Mock] Cancelled reservation:', id);
    // Real: await axiosInstance.post(API_ENDPOINTS.RESERVATIONS.CANCEL(id));
  },
};
