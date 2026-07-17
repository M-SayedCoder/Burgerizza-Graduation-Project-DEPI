import type { Order, PlaceOrderRequest } from '../types/order.types';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/api.constants';

const mapImageUrl = (img?: string): string => {
  if (!img) return '/assets/images/Burger.avif';
  if (img.startsWith('/uploads')) {
    return `http://localhost:5000${img}`;
  }
  if (img.startsWith('uploads/')) {
    return `http://localhost:5000/${img}`;
  }
  return img;
};

const mapBackendOrderToCustomerOrder = (backendOrder: any): Order => {
  return {
    id: backendOrder._id,
    userId: typeof backendOrder.customer === 'object' ? backendOrder.customer._id : backendOrder.customer,
    items: (backendOrder.items || []).map((item: any, idx: number) => ({
      id: item._id || `oi-${idx}`,
      menuItemId: typeof item.menuItem === 'object' ? item.menuItem._id : item.menuItem,
      name: typeof item.menuItem === 'object' ? item.menuItem.name : 'Meal',
      price: item.price,
      quantity: item.quantity,
      size: 'medium',
      image: mapImageUrl(typeof item.menuItem === 'object' ? item.menuItem.imageUrl : undefined),
    })),
    status: (backendOrder.status || 'Pending').toLowerCase() as any,
    total: backendOrder.total,
    deliveryAddress: 'Cairo, Egypt',
    notes: backendOrder.notes || '',
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt,
    estimatedDelivery: '30-45 min',
  };
};

export const orderService = {
  /**
   * Get all orders for the authenticated user
   */
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<any>(API_ENDPOINTS.ORDERS.LIST);
    const orders = response.data.data || [];
    return orders.map(mapBackendOrderToCustomerOrder);
  },

  /**
   * Get single order by ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get<any>(API_ENDPOINTS.ORDERS.DETAIL(id));
    return mapBackendOrderToCustomerOrder(response.data.data);
  },

  /**
   * Place a new order
   */
  placeOrder: async (data: PlaceOrderRequest): Promise<Order> => {
    const payload = {
      items: data.items.map((item) => ({
        menuItem: item.menuItemId,
        quantity: item.quantity,
      })),
      notes: data.notes,
    };
    const response = await axiosInstance.post<any>(API_ENDPOINTS.ORDERS.PLACE, payload);
    return mapBackendOrderToCustomerOrder(response.data.data);
  },
};

