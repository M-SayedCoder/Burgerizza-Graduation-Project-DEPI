// ─── Reservation Types ──────────────────────────────────────────

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  userId: string;
  date: string;        // ISO date string
  time: string;        // e.g. "19:00"
  guests: number;
  name: string;
  phone: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface BookTableRequest {
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  notes?: string;
}
