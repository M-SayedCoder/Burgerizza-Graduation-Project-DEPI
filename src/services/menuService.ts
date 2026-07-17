import { Menu, PaginatedResponse, ApiResponse } from '../types';
import { mockMenu } from './mockData';
import { MOCK, delay } from './config';
import * as menuApi from '../api/menuApi';

let _menu = [...mockMenu];

interface MenuFilters { page?: number; limit?: number; search?: string; category?: string; sort?: string; }

export const menuService = {
  async getAll(filters: MenuFilters = {}): Promise<PaginatedResponse<Menu>> {
    if (!MOCK.menu) return menuApi.getMenu(filters).then((r) => r.data);

    await delay();
    let data = [..._menu];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    if (filters.category) data = data.filter((m) => m.category === filters.category);
    if (filters.sort === 'price') data.sort((a, b) => a.price - b.price);
    if (filters.sort === '-price') data.sort((a, b) => b.price - a.price);

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const total = data.length;
    data = data.slice((page - 1) * limit, page * limit);

    return { success: true, data, total, page, pages: Math.ceil(total / limit) };
  },

  async getById(id: string): Promise<ApiResponse<Menu>> {
    if (!MOCK.menu) return menuApi.getMenuById(id).then((r) => r.data);
    await delay(200);
    const item = _menu.find((m) => m._id === id);
    if (!item) throw new Error('Menu item not found');
    return { success: true, message: 'Success', data: item };
  },

  async create(formData: FormData): Promise<ApiResponse<Menu>> {
    if (!MOCK.menu) return menuApi.createMenu(formData).then((r) => r.data);
    await delay(600);
    const newItem: Menu = {
      _id: 'm' + Date.now(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as Menu['category'],
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
      isAvailable: formData.get('isAvailable') === 'true',
    };
    _menu.unshift(newItem);
    return { success: true, message: 'Meal added', data: newItem };
  },

  async update(id: string, formData: FormData): Promise<ApiResponse<Menu>> {
    if (!MOCK.menu) return menuApi.updateMenu(id, formData).then((r) => r.data);
    await delay(600);
    _menu = _menu.map((m) =>
      m._id === id
        ? { ...m, name: formData.get('name') as string || m.name, description: formData.get('description') as string || m.description, price: Number(formData.get('price')) || m.price, category: (formData.get('category') as Menu['category']) || m.category, isAvailable: formData.get('isAvailable') === 'true' }
        : m
    );
    const updated = _menu.find((m) => m._id === id)!;
    return { success: true, message: 'Meal updated', data: updated };
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    if (!MOCK.menu) return menuApi.deleteMenu(id).then((r) => r.data);
    await delay(400);
    _menu = _menu.filter((m) => m._id !== id);
    return { success: true, message: 'Meal deleted', data: null };
  },

  async toggleAvailability(id: string): Promise<ApiResponse<Menu>> {
    if (!MOCK.menu) return menuApi.toggleAvailability(id).then((r) => r.data);
    await delay(300);
    _menu = _menu.map((m) => m._id === id ? { ...m, isAvailable: !m.isAvailable } : m);
    const updated = _menu.find((m) => m._id === id)!;
    return { success: true, message: 'Availability updated', data: updated };
  },
};
