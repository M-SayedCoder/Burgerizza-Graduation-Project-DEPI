import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { addItem, removeItem, increaseQty, decreaseQty, clearCart } from '../store/cartSlice';
import type { AddToCartPayload } from '../types/cart.types';

// ─── useCart Hook ──────────────────────────────────────────────────
// Provides cart state and dispatch actions from Redux store

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const addToCart = (item: AddToCartPayload) => {
    dispatch(addItem(item));
  };

  const removeFromCart = (id: string) => {
    dispatch(removeItem(id));
  };

  const increaseQuantity = (id: string) => {
    dispatch(increaseQty(id));
  };

  const decreaseQuantity = (id: string) => {
    dispatch(decreaseQty(id));
  };

  const clear = () => {
    dispatch(clearCart());
  };

  return {
    items: cart.items,
    total: cart.total,
    count: cart.count,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clear,
  };
};
