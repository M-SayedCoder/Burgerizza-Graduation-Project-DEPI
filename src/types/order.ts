export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Delivered"
  | "Cancelled";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "manager" | "admin";
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;

  customer: Customer;

  items: OrderItem[];

  total: number;

  status: OrderStatus;

  createdAt: string;

  updatedAt: string;
}
export interface GetOrdersParams {
  search?: string;
  status?: OrderStatus;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface GetOrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateOrderPayload {
  customer?: string;

  items: {
    menuItem: string;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}