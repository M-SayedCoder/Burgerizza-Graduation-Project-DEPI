import type { Order, PlaceOrderRequest, OrderStatus } from '../types/order.types';

// ─── Mock Data ────────────────────────────────────────────────────

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    items: [
      { id: 'oi-1', menuItemId: '1', name: 'Classic Beef Burger', price: 10, quantity: 2, size: 'medium', image: '/assets/images/Burger.avif' },
      { id: 'oi-2', menuItemId: '2', name: 'Pepperoni Pizza', price: 12.5, quantity: 1, size: 'medium' },
    ],
    status: 'preparing',
    total: 32.50,
    deliveryAddress: '2118 Thornridge Cir. Syracuse',
    notes: 'No onions please',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: '25-35 min',
  },
  {
    id: 'ORD-002',
    userId: '1',
    items: [
      { id: 'oi-3', menuItemId: '5', name: 'Pizza Calzone', price: 13.99, quantity: 1, size: 'large' },
    ],
    status: 'delivered',
    total: 13.99,
    deliveryAddress: '2118 Thornridge Cir. Syracuse',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Order Service ────────────────────────────────────────────────

export const orderService = {
  /**
   * Get all orders for the authenticated user
   * TODO: Replace with real API call → GET /orders
   */
  getOrders: async (): Promise<Order[]> => {
    await new Promise((r) => setTimeout(r, 500));
    // Real: const response = await axiosInstance.get<Order[]>(API_ENDPOINTS.ORDERS.LIST);
    // return response.data;
    return [...MOCK_ORDERS];
  },

  /**
   * Get single order by ID
   * TODO: Replace with real API call → GET /orders/:id
   */
  getOrderById: async (id: string): Promise<Order> => {
    await new Promise((r) => setTimeout(r, 300));
    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    // Real: const response = await axiosInstance.get<Order>(API_ENDPOINTS.ORDERS.DETAIL(id));
    // return response.data;
    return order;
  },

  /**
   * Place a new order
   * TODO: Replace with real API call → POST /orders
   */
  placeOrder: async (data: PlaceOrderRequest): Promise<Order> => {
    await new Promise((r) => setTimeout(r, 800));
    const newOrder: Order = {
      id: 'ORD-' + Date.now(),
      userId: '1',
      items: data.items.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        menuItemId: item.menuItemId,
        name: 'Order Item',
        price: 10,
        quantity: item.quantity,
        size: item.size,
      })),
      status: 'pending' as OrderStatus,
      total: 0,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: '30-45 min',
    };
    // Real: const response = await axiosInstance.post<Order>(API_ENDPOINTS.ORDERS.PLACE, data);
    // return response.data;
    return newOrder;
  },
};
