// ─── API Endpoint Constants ─────────────────────────────────────
// TODO: Replace placeholder paths with real backend endpoints.

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },

  // Menu
  MENU: {
    ITEMS: '/menu',
    ITEM_BY_ID: (id: string) => `/menu/${id}`,
    CATEGORIES: '/categories',
  },

  // Cart (server-side cart if needed later)
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (id: string) => `/cart/items/${id}`,
    REMOVE: (id: string) => `/cart/items/${id}`,
    CLEAR: '/cart/clear',
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    PLACE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    TRACK: (id: string) => `/orders/${id}/track`,
  },

  // Reservations
  RESERVATIONS: {
    LIST: '/reservations',
    BOOK: '/reservations',
    DETAIL: (id: string) => `/reservations/${id}`,
    CANCEL: (id: string) => `/reservations/${id}/cancel`,
  },

  // Profile
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    UPLOAD_AVATAR: '/profile/avatar',
    ADDRESSES: '/profile/addresses',
    ADD_ADDRESS: '/profile/addresses',
    DELETE_ADDRESS: (id: string) => `/profile/addresses/${id}`,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'burgerizza_token',
  USER: 'burgerizza_user',
  CART: 'burgerizza_cart',
  THEME: 'burgerizza_theme',
} as const;
