import type { MenuItem, MenuCategory, GetMenuParams, MenuResponse } from '../types/menu.types';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/api.constants';

// ─── Mock Data ────────────────────────────────────────────────────
// TODO: Remove mock data when real backend is connected.

export const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: 'All', image: '/assets/images/all.jpg' },
  { id: 'burger', name: 'Burger', image: '/assets/images/Burger.avif' },
  { id: 'pizza', name: 'Pizza', image: '/assets/images/Pizza.jpg' },
  { id: 'pasta', name: 'Pasta', image: '/assets/images/pasta.webp' },
  { id: 'hotdog', name: 'Hot Dog', image: '/assets/images/Hotdog.jpg' },
  { id: 'sides', name: 'Sides', image: '/assets/images/all.jpg' },
  { id: 'drinks', name: 'Drinks', image: '/assets/images/all.jpg' },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Beef Burger',
    description: 'Juicy beef patty, fresh lettuce, ripe tomatoes, and our secret sauce, all nestled in a warm brioche bun.',
    price: 8.99,
    image: '/assets/images/Burger.avif',
    categoryId: 'burger',
    categoryName: 'Burger',
    rating: 4.9,
    deliveryTime: 20,
    deliveryFee: 0,
    sizes: [
      { size: 'small', label: 'Small', price: 5 },
      { size: 'medium', label: 'Medium', price: 10 },
      { size: 'large', label: 'Large', price: 15 },
    ],
    ingredients: ['Beef', 'Lettuce', 'Tomatoes', 'Cheese'],
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni pizza with mozzarella cheese and our signature tomato sauce.',
    price: 12.50,
    image: '/assets/images/Pizza.jpg',
    categoryId: 'pizza',
    categoryName: 'Pizza',
    rating: 4.5,
    deliveryTime: 25,
    deliveryFee: 0,
    sizes: [
      { size: 'small', label: 'Small (8")', price: 8.5 },
      { size: 'medium', label: 'Medium (12")', price: 12.5 },
      { size: 'large', label: 'Large (16")', price: 16.5 },
    ],
    ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Oregano'],
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Italian Pasta',
    description: 'Homemade pasta with rich marinara sauce and fresh basil.',
    price: 10.00,
    image: '/assets/images/pasta.webp',
    categoryId: 'pasta',
    categoryName: 'Pasta',
    rating: 4.8,
    deliveryTime: 22,
    deliveryFee: 0,
    sizes: [
      { size: 'small', label: 'Small', price: 7 },
      { size: 'medium', label: 'Regular', price: 10 },
      { size: 'large', label: 'Large', price: 13 },
    ],
    ingredients: ['Pasta', 'Tomato Sauce', 'Basil', 'Parmesan'],
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: '4',
    name: 'Classic Hot Dog',
    description: 'Premium beef frankfurter with mustard, ketchup and caramelized onions.',
    price: 6.99,
    image: '/assets/images/Hotdog.jpg',
    categoryId: 'hotdog',
    categoryName: 'Hot Dog',
    rating: 4.3,
    deliveryTime: 15,
    deliveryFee: 0,
    sizes: [
      { size: 'small', label: 'Regular', price: 6.99 },
      { size: 'medium', label: 'Large', price: 8.99 },
      { size: 'large', label: 'Jumbo', price: 10.99 },
    ],
    ingredients: ['Beef Frankfurter', 'Mustard', 'Ketchup', 'Onions'],
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: '5',
    name: 'Pizza Calzone',
    description: 'Folded pizza stuffed with ricotta, spinach and mozzarella.',
    price: 13.99,
    image: '/assets/images/Pizza.jpg',
    categoryId: 'pizza',
    categoryName: 'Pizza',
    rating: 4.7,
    deliveryTime: 30,
    deliveryFee: 0,
    sizes: [
      { size: 'small', label: 'Small (8")', price: 10 },
      { size: 'medium', label: 'Medium (12")', price: 13.99 },
      { size: 'large', label: 'Large (14")', price: 17 },
    ],
    ingredients: ['Ricotta', 'Spinach', 'Mozzarella', 'Ham'],
    isAvailable: true,
    isPopular: true,
  },
  {
    id: '6',
    name: 'Double Smash Burger',
    description: 'Two smashed beef patties, American cheese, pickles and special sauce.',
    price: 11.99,
    image: '/assets/images/Burger.avif',
    categoryId: 'burger',
    categoryName: 'Burger',
    rating: 4.9,
    deliveryTime: 20,
    deliveryFee: 0,
    sizes: [
      { size: 'small', label: 'Single', price: 8.99 },
      { size: 'medium', label: 'Double', price: 11.99 },
      { size: 'large', label: 'Triple', price: 14.99 },
    ],
    ingredients: ['Beef', 'American Cheese', 'Pickles', 'Special Sauce'],
    isAvailable: true,
    isPopular: true,
    isFeatured: true,
  },
];

const mapImageUrl = (img?: string): string => {
  if (!img) return '/assets/images/Pizza.jpg';
  if (img.startsWith('/uploads')) {
    return `http://localhost:5000${img}`;
  }
  if (img.startsWith('uploads/')) {
    return `http://localhost:5000/${img}`;
  }
  return img;
};

// ─── Menu Service ─────────────────────────────────────────────────

export const menuService = {
  /**
   * Get all menu items with optional filtering
   */
  getMenuItems: async (params?: GetMenuParams): Promise<MenuResponse> => {
    try {
      const backendParams: any = {};
      if (params?.search) {
        backendParams.search = params.search;
      }
      if (params?.categoryId && params.categoryId !== 'all') {
        const categoryMap: { [key: string]: string } = {
          burger: 'Burger',
          pizza: 'Pizza',
          pasta: 'Pasta',
          hotdog: 'Hot Dog',
          sides: 'Sides',
          drinks: 'Drinks'
        };
        backendParams.category = categoryMap[params.categoryId.toLowerCase()] || params.categoryId;
      }
      if (params?.page) backendParams.page = params.page;
      if (params?.limit) backendParams.limit = params.limit;

      const response = await axiosInstance.get<any>(API_ENDPOINTS.MENU.ITEMS, { params: backendParams });
      const responseData = response.data;

      const rawItems = Array.isArray(responseData.data)
        ? responseData.data
        : Array.isArray(responseData.items)
        ? responseData.items
        : [];

      const items = rawItems.map((item: any) => ({
        id: item._id || item.id,
        name: item.name || '',
        description: item.description || '',
        price: Number(item.price) || 0,
        image: mapImageUrl(item.imageUrl || item.image),
        categoryId: (item.category || item.categoryId || 'all').toLowerCase().replace(/\s+/g, ''),
        categoryName: item.category || item.categoryName || 'All',
        rating: item.rating || 4.5,
        deliveryTime: item.deliveryTime || 25,
        deliveryFee: item.deliveryFee || 0,
        sizes: item.sizes || [
          { size: 'small', label: 'Small', price: Number(item.price) || 0 },
          { size: 'medium', label: 'Medium', price: Number(item.price) || 0 },
          { size: 'large', label: 'Large', price: Number(item.price) || 0 },
        ],
        ingredients: item.ingredients || [],
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        isPopular: item.isPopular || false,
        isFeatured: item.isFeatured || false,
      }));

      return {
        items,
        total: responseData.total !== undefined ? responseData.total : items.length,
        page: responseData.page !== undefined ? responseData.page : 1,
        limit: responseData.limit !== undefined ? responseData.limit : 20,
      };
    } catch (error) {
      console.error('getMenuItems failed:', error);
      throw error;
    }
  },

  /**
   * Get single menu item by ID
   */
  getMenuItemById: async (id: string): Promise<MenuItem> => {
    try {
      const response = await axiosInstance.get<any>(API_ENDPOINTS.MENU.ITEM_BY_ID(id));
      const item = response.data.data;
      if (!item) throw new Error('Menu item not found');

      return {
        id: item._id || item.id,
        name: item.name || '',
        description: item.description || '',
        price: Number(item.price) || 0,
        image: mapImageUrl(item.imageUrl || item.image),
        categoryId: (item.category || item.categoryId || 'all').toLowerCase().replace(/\s+/g, ''),
        categoryName: item.category || item.categoryName || 'All',
        rating: item.rating || 4.5,
        deliveryTime: item.deliveryTime || 25,
        deliveryFee: item.deliveryFee || 0,
        sizes: item.sizes || [
          { size: 'small', label: 'Small', price: Number(item.price) || 0 },
          { size: 'medium', label: 'Medium', price: Number(item.price) || 0 },
          { size: 'large', label: 'Large', price: Number(item.price) || 0 },
        ],
        ingredients: item.ingredients || [],
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        isPopular: item.isPopular || false,
        isFeatured: item.isFeatured || false,
      };
    } catch (error) {
      console.error('getMenuItemById failed:', error);
      throw error;
    }
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<MenuCategory[]> => {
    return MOCK_CATEGORIES;
  },
};
