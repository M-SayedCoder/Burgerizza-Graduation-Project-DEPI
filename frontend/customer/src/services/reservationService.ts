import type { Reservation, BookTableRequest } from '../types/reservation.types';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/api.constants';

const mapBackendReservationToCustomerReservation = (backendRes: any): Reservation => {
  return {
    id: backendRes._id,
    userId: typeof backendRes.customer === 'object' ? backendRes.customer._id : backendRes.customer,
    date: backendRes.date,
    time: backendRes.time,
    guests: backendRes.partySize,
    name: typeof backendRes.customer === 'object' ? backendRes.customer.name : 'Customer',
    phone: typeof backendRes.customer === 'object' ? backendRes.customer.phone : '',
    notes: backendRes.notes || '',
    status: (backendRes.status || 'Pending').toLowerCase() as any,
    createdAt: backendRes.createdAt,
  };
};

export const reservationService = {
  /**
   * Get all reservations for the authenticated user
   */
  getReservations: async (): Promise<Reservation[]> => {
    const response = await axiosInstance.get<any>(API_ENDPOINTS.RESERVATIONS.LIST);
    const reservations = response.data.data || [];
    return reservations.map(mapBackendReservationToCustomerReservation);
  },

  /**
   * Book a table
   */
  bookTable: async (data: BookTableRequest): Promise<Reservation> => {
    const payload = {
      date: data.date,
      time: data.time,
      partySize: data.guests,
      notes: data.notes,
    };
    const response = await axiosInstance.post<any>(API_ENDPOINTS.RESERVATIONS.BOOK, payload);
    return mapBackendReservationToCustomerReservation(response.data.data);
  },

  /**
   * Cancel a reservation
   */
  cancelReservation: async (id: string): Promise<void> => {
    // Standard cancel using our updated status editor PUT endpoint
    await axiosInstance.put(`/reservations/${id}`, { status: 'Cancelled' });
  },

  /**
   * Edit a reservation
   */
  editReservation: async (id: string, data: BookTableRequest): Promise<Reservation> => {
    const payload = {
      date: data.date,
      time: data.time,
      partySize: data.guests,
      notes: data.notes,
    };
    const response = await axiosInstance.put<any>(`/reservations/${id}`, payload);
    return mapBackendReservationToCustomerReservation(response.data.data);
  },
};

