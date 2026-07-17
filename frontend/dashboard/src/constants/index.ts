// Vite proxy handles routing: /api/auth+menu → :5001 | rest → :5000
export const BASE_URL = '/api';

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'] as const;
export const RESERVATION_STATUSES = ['Pending', 'Confirmed', 'Rejected', 'Cancelled'] as const;
export const CATEGORIES = ['Burger', 'Pizza', 'Drinks', 'Desserts', 'Sides'] as const;

export const ROLES = {
  CUSTOMER: 'customer',
  MANAGER: 'manager',
  ADMIN: 'admin',
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
export type Category = (typeof CATEGORIES)[number];
export type Role = (typeof ROLES)[keyof typeof ROLES];
