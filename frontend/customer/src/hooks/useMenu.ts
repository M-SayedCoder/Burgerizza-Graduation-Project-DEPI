import { useState, useEffect, useCallback } from 'react';
import { menuService } from '../services/menuService';
import type { MenuItem, MenuCategory, GetMenuParams } from '../types/menu.types';

export const useMenu = (initialParams?: GetMenuParams) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetMenuParams | undefined>(initialParams);

  const fetchItems = useCallback(async (searchParams?: GetMenuParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuService.getMenuItems(searchParams);
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await menuService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchItems(params);
  }, [params, fetchItems]);

  const updateParams = (newParams: GetMenuParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  return {
    items,
    categories,
    loading,
    error,
    params,
    updateParams,
    refetch: () => fetchItems(params),
  };
};
