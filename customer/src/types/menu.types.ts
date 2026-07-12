// ─── Menu / Product Types ───────────────────────────────────────

export type MenuItemSize = 'small' | 'medium' | 'large';

export interface SizeOption {
  size: MenuItemSize;
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  categoryName: string;
  rating: number;
  deliveryTime: number; // minutes
  deliveryFee: number;  // 0 = free
  sizes: SizeOption[];
  ingredients: string[];
  isAvailable: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  image: string;
  itemCount?: number;
}

export interface GetMenuParams {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MenuResponse {
  items: MenuItem[];
  total: number;
  page: number;
  limit: number;
}
