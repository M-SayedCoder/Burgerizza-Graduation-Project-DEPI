export type ReservationStatus =
  | "Pending"
  | "Confirmed"
  | "Rejected"
  | "Cancelled";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "manager" | "admin";
}

export interface Reservation {
  _id: string;

  customer: Customer;

  date: string;

  time: string;

  partySize: number;

  status: ReservationStatus;

  notes?: string;

  createdAt: string;

  updatedAt: string;
}

export interface GetReservationsParams {
  status?: ReservationStatus;

  sort?: string;

  page?: number;

  limit?: number;
}

export interface GetReservationsResponse {
  reservations: Reservation[];

  pagination: {
    total: number;

    page: number;

    limit: number;

    pages: number;
  };
}

export interface CreateReservationPayload {
  customer?: string;

  date: string;

  time: string;

  partySize: number;

  notes?: string;
}

export interface UpdateReservationPayload {
  date?: string;

  time?: string;

  partySize?: number;

  notes?: string;

  status?: ReservationStatus;
}

export interface UpdateReservationStatusPayload {
  status: ReservationStatus;
}