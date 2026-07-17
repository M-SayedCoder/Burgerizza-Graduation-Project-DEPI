import { Category, OrderStatus, ReservationStatus } from '../constants';

export interface Menu {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isAvailable: boolean;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
    address?: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Reservation {
  _id: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
  };
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'manager' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface DailyStat {
  _id: string;
  revenue: number;
  ordersCount: number;
}
