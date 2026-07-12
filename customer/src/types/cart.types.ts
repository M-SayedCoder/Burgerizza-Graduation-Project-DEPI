import type { MenuItemSize } from './menu.types';

// ─── Cart Types ─────────────────────────────────────────────────

export interface CartItem {
  id: string;          // unique: menuItemId + size
  menuItemId: string;
  name: string;
  price: number;
  size: MenuItemSize;
  sizeLabel: string;
  image: string;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;       // total number of items (sum of quantities)
}

export interface AddToCartPayload {
  menuItemId: string;
  name: string;
  price: number;
  size: MenuItemSize;
  sizeLabel: string;
  image: string;
}

// ─── Cart State (Redux) ─────────────────────────────────────────

export interface CartState {
  items: CartItem[];
  total: number;
  count: number;
}
