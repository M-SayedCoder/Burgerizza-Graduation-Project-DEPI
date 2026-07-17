import { ORDER_STATUSES, RESERVATION_STATUSES, CATEGORIES, ROLES } from './index';

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
export type Category = (typeof CATEGORIES)[number];
export type Role = (typeof ROLES)[keyof typeof ROLES];
