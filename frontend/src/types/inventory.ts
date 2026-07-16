export interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;          // kg, piece, liter, box, pack
  minQuantity: number;   // حد التنبيه للمخزون المنخفض
  supplier?: string;
  costPerUnit?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InventoryFormPayload = Omit<InventoryItem, '_id' | 'createdAt' | 'updatedAt'>;
