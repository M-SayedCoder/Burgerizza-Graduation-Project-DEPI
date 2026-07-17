import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartItem, AddToCartPayload } from '../types/cart.types';
import { STORAGE_KEYS } from '../constants/api.constants';

// ─── Helpers ──────────────────────────────────────────────────────

const computeTotals = (items: CartItem[]) => ({
  total: items.reduce((sum, item) => sum + item.subtotal, 0),
  count: items.reduce((sum, item) => sum + item.quantity, 0),
});

const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
};

// ─── Rehydrate from localStorage ─────────────────────────────────

const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
const storedItems: CartItem[] = storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
const { total: storedTotal, count: storedCount } = computeTotals(storedItems);

const initialState: CartState = {
  items: storedItems,
  total: storedTotal,
  count: storedCount,
};

// ─── Cart Slice ───────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add item to cart. If same item+size already exists, increase quantity.
     */
    addItem: (state, action: PayloadAction<AddToCartPayload>) => {
      const payload = action.payload;
      const itemId = `${payload.menuItemId}-${payload.size}`;
      const existing = state.items.find((i) => i.id === itemId);

      if (existing) {
        existing.quantity += 1;
        existing.subtotal = existing.quantity * existing.price;
      } else {
        state.items.push({
          id: itemId,
          menuItemId: payload.menuItemId,
          name: payload.name,
          price: payload.price,
          size: payload.size,
          sizeLabel: payload.sizeLabel,
          image: payload.image,
          quantity: 1,
          subtotal: payload.price,
        });
      }

      const totals = computeTotals(state.items);
      state.total = totals.total;
      state.count = totals.count;
      saveCartToStorage(state.items);
    },

    /**
     * Remove an item completely from cart
     */
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      const totals = computeTotals(state.items);
      state.total = totals.total;
      state.count = totals.count;
      saveCartToStorage(state.items);
    },

    /**
     * Increase item quantity by 1
     */
    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
        item.subtotal = item.quantity * item.price;
      }
      const totals = computeTotals(state.items);
      state.total = totals.total;
      state.count = totals.count;
      saveCartToStorage(state.items);
    },

    /**
     * Decrease item quantity by 1. Remove if quantity reaches 0.
     */
    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        } else {
          item.quantity -= 1;
          item.subtotal = item.quantity * item.price;
        }
      }
      const totals = computeTotals(state.items);
      state.total = totals.total;
      state.count = totals.count;
      saveCartToStorage(state.items);
    },

    /**
     * Clear all items from cart
     */
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.count = 0;
      localStorage.removeItem(STORAGE_KEYS.CART);
    },
  },
});

export const { addItem, removeItem, increaseQty, decreaseQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
