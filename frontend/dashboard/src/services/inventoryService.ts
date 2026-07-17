import { InventoryItem, InventoryFormPayload } from '../types/inventory';
import { ApiResponse, PaginatedResponse } from '../types';
import { MOCK, delay } from './config';
import * as inventoryApi from '../api/inventoryApi';
import { mockInventory } from './mockData';

interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const inventoryService = {
  async getAll(filters: InventoryFilters = {}): Promise<PaginatedResponse<InventoryItem>> {
    if (!MOCK.inventory) return inventoryApi.getInventory(filters).then((r) => r.data);

    await delay();
    let data = [...mockInventory];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (i) => i.name.toLowerCase().includes(q) || i.supplier?.toLowerCase().includes(q)
      );
    }
    if (filters.category) data = data.filter((i) => i.category === filters.category);
    if (filters.isActive !== undefined) data = data.filter((i) => i.isActive === filters.isActive);

    if (filters.sortBy === 'name') {
      data.sort((a, b) =>
        filters.order === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      );
    } else if (filters.sortBy === 'quantity') {
      data.sort((a, b) => filters.order === 'desc' ? b.quantity - a.quantity : a.quantity - b.quantity);
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const total = data.length;
    const sliced = data.slice((page - 1) * limit, page * limit);

    return { success: true, data: sliced, total, page, pages: Math.ceil(total / limit) };
  },

  async getLowStock(): Promise<InventoryItem[]> {
    if (!MOCK.inventory) return inventoryApi.getLowStock().then((r) => r.data.data);
    await delay(300);
    return mockInventory.filter((i) => i.isActive && i.quantity <= i.minQuantity);
  },

  async getById(id: string): Promise<ApiResponse<InventoryItem>> {
    if (!MOCK.inventory) return inventoryApi.getInventoryById(id).then((r) => r.data);
    await delay(200);
    const item = mockInventory.find((i) => i._id === id);
    if (!item) throw new Error('Item not found');
    return { success: true, message: 'Success', data: item };
  },

  async create(data: InventoryFormPayload): Promise<ApiResponse<InventoryItem>> {
    if (!MOCK.inventory) return inventoryApi.createInventoryItem(data).then((r) => r.data);
    await delay(600);
    const newItem: InventoryItem = {
      ...data,
      _id: 'inv_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockInventory.unshift(newItem);
    return { success: true, message: 'Item added', data: newItem };
  },

  async update(id: string, data: Partial<InventoryFormPayload>): Promise<ApiResponse<InventoryItem>> {
    if (!MOCK.inventory) return inventoryApi.updateInventoryItem(id, data).then((r) => r.data);
    await delay(500);
    const idx = mockInventory.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Item not found');
    mockInventory[idx] = { ...mockInventory[idx], ...data, updatedAt: new Date().toISOString() };
    return { success: true, message: 'Item updated', data: mockInventory[idx] };
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    if (!MOCK.inventory) return inventoryApi.deleteInventoryItem(id).then((r) => r.data);
    await delay(400);
    const idx = mockInventory.findIndex((i) => i._id === id);
    if (idx !== -1) mockInventory[idx].isActive = false;
    return { success: true, message: 'Item deleted', data: null };
  },

  async restore(id: string): Promise<ApiResponse<InventoryItem>> {
    if (!MOCK.inventory) return inventoryApi.restoreInventoryItem(id).then((r) => r.data);
    await delay(400);
    const idx = mockInventory.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Item not found');
    mockInventory[idx].isActive = true;
    mockInventory[idx].updatedAt = new Date().toISOString();
    return { success: true, message: 'Item restored', data: mockInventory[idx] };
  },
};
