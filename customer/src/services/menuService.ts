import type { MenuItem, MenuCategory, GetMenuParams, MenuResponse } from '../types/menu.types';

// ─── Mock Data ────────────────────────────────────────────────────
// TODO: Remove mock data when real backend is connected.

export const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: 'All', image: '/assets/images/all.jpg' },
  { id: 'burger', name: 'Burger', image: '/assets/images/Burger.avif' },
  { id: 'pizza', name: 'Pizza', image: '/assets/images/Pizza.jpg' },
  { id: 'pasta', name: 'Pasta', image: '/assets/images/pasta.webp' },
  { id: 'hotdog', name: 'Hot Dog', image: '/assets/images/Hotdog.jpg' },
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

// ─── Menu Service ─────────────────────────────────────────────────

export const menuService = {
  /**
   * Get all menu items with optional filtering
   * TODO: Replace with real API call → GET /menu
   */
  getMenuItems: async (params?: GetMenuParams): Promise<MenuResponse> => {
    await new Promise((r) => setTimeout(r, 400));

    let items = [...MOCK_MENU_ITEMS];

    if (params?.categoryId && params.categoryId !== 'all') {
      items = items.filter((item) => item.categoryId === params.categoryId);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q)
      );
    }

    // Real: const response = await axiosInstance.get<MenuResponse>(API_ENDPOINTS.MENU.ITEMS, { params });
    // return response.data;

    return { items, total: items.length, page: 1, limit: 20 };
  },

  /**
   * Get single menu item by ID
   * TODO: Replace with real API call → GET /menu/:id
   */
  getMenuItemById: async (id: string): Promise<MenuItem> => {
    await new Promise((r) => setTimeout(r, 300));
    const item = MOCK_MENU_ITEMS.find((m) => m.id === id);
    if (!item) throw new Error('Menu item not found');

    // Real: const response = await axiosInstance.get<MenuItem>(API_ENDPOINTS.MENU.ITEM_BY_ID(id));
    // return response.data;

    return item;
  },

  /**
   * Get all categories
   * TODO: Replace with real API call → GET /categories
   */
  getCategories: async (): Promise<MenuCategory[]> => {
    await new Promise((r) => setTimeout(r, 300));

    // Real: const response = await axiosInstance.get<MenuCategory[]>(API_ENDPOINTS.MENU.CATEGORIES);
    // return response.data;

    return MOCK_CATEGORIES;
  },
};
