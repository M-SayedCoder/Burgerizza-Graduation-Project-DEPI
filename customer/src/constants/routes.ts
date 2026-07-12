// ─── Application Routes ─────────────────────────────────────────

export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  MENU_DETAIL: '/menu/:id',
  CATEGORIES: '/categories',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  RESERVATIONS: '/reservations',
  PROFILE: '/profile',
  ADDRESS: '/address',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

// Helper to build dynamic routes
export const buildRoute = {
  menuDetail: (id: string) => `/menu/${id}`,
  orderDetail: (id: string) => `/orders/${id}`,
};
