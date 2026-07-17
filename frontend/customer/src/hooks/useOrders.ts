import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';
import type { Order, PlaceOrderRequest } from '../types/order.types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const placeNewOrder = async (request: PlaceOrderRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await orderService.placeOrder(request);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    placeNewOrder,
  };
};
