import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdAdd, MdEdit, MdDelete, MdRestore, MdWarning, MdSearch } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { inventoryService } from '../../services/inventoryService';
import { InventoryItem, InventoryFormPayload } from '../../types/inventory';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const INVENTORY_CATEGORIES = ['Meat', 'Bakery', 'Dairy', 'Vegetables', 'Beverages', 'Desserts', 'Packaging', 'Spices', 'Other'] as const;
const UNITS = ['piece', 'kg', 'liter', 'box', 'pack', 'gram', 'ml'] as const;

const schema = z.object({
  name:         z.string().min(2, 'Name required'),
  category:     z.enum(INVENTORY_CATEGORIES),
  quantity:     z.coerce.number().min(0, 'Must be ≥ 0'),
  unit:         z.enum(UNITS),
  minQuantity:  z.coerce.number().min(0, 'Must be ≥ 0'),
  supplier:     z.string().optional(),
  costPerUnit:  z.coerce.number().min(0).optional(),
  isActive:     z.boolean(),
});
type FormValues = z.infer<typeof schema>;

// ---- Inventory Form ----
const InventoryForm = ({
  defaultValues,
  onSubmit,
  isLoading,
}: {
  defaultValues?: Partial<InventoryItem>;
  onSubmit: (data: InventoryFormPayload) => void;
  isLoading?: boolean;
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: defaultValues?.name ?? '',
      category: (defaultValues?.category as (typeof INVENTORY_CATEGORIES)[number]) ?? 'Meat',
      quantity: defaultValues?.quantity ?? 0,
      unit: (defaultValues?.unit as (typeof UNITS)[number]) ?? 'piece',
      minQuantity: defaultValues?.minQuantity ?? 10,
      supplier: defaultValues?.supplier ?? '',
      costPerUnit: defaultValues?.costPerUnit ?? 0,
      isActive: defaultValues?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
          <input {...register('name')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select {...register('category')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            {INVENTORY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
          <select {...register('unit')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Quantity</label>
          <input type="number" {...register('quantity')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Min Stock Alert</label>
          <input type="number" {...register('minQuantity')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          {errors.minQuantity && <p className="text-red-500 text-xs mt-1">{errors.minQuantity.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
          <input {...register('supplier')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Supplier name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cost per Unit (EGP)</label>
          <input type="number" {...register('costPerUnit')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 accent-orange-500" />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active (tracked)</label>
        </div>
      </div>
      <Button type="submit" isLoading={isLoading} className="w-full">
        {defaultValues?._id ? 'Update Item' : 'Add Item'}
      </Button>
    </form>
  );
};

// ---- Main Page ----
const Inventory = () => {
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');
  const [viewInactive, setViewInactive] = useState(false);
  const [editTarget, setEditTarget]     = useState<InventoryItem | null>(null);
  const [showAdd, setShowAdd]           = useState(false);

  const qc = useQueryClient();

  const filters = {
    search:   search || undefined,
    category: category || undefined,
    isActive: viewInactive ? false : undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['inventory', filters],
    queryFn:  () => inventoryService.getAll(filters),
  });

  const { data: lowStockItems = [] } = useQuery({
    queryKey: ['inventory-low-stock'],
    queryFn:  () => inventoryService.getLowStock(),
  });

  const createMut  = useMutation({ mutationFn: (d: InventoryFormPayload) => inventoryService.create(d),  onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); toast.success('Item added!');    setShowAdd(false); }, onError: () => toast.error('Failed') });
  const updateMut  = useMutation({ mutationFn: ({ id, d }: { id: string; d: Partial<InventoryFormPayload> }) => inventoryService.update(id, d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); toast.success('Item updated!'); setEditTarget(null); }, onError: () => toast.error('Failed') });
  const deleteMut  = useMutation({ mutationFn: (id: string) => inventoryService.delete(id),   onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); toast.success('Item removed'); },   onError: () => toast.error('Failed') });
  const restoreMut = useMutation({ mutationFn: (id: string) => inventoryService.restore(id),  onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); toast.success('Item restored'); },  onError: () => toast.error('Failed') });

  const handleDelete = async (item: InventoryItem) => {
    const res = await Swal.fire({ title: `Delete "${item.name}"?`, text: 'Item will be deactivated.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete' });
    if (res.isConfirmed) deleteMut.mutate(item._id);
  };

  const items = data?.data ?? [];

  const summaryCards = [
    { label: 'Total Items',  value: data?.total ?? 0,            color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Low Stock',    value: lowStockItems.length,         color: 'bg-red-50 text-red-700 border-red-200'   },
    { label: 'Categories',  value: INVENTORY_CATEGORIES.length,  color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
        <Button onClick={() => setShowAdd(true)}><MdAdd className="mr-1" /> Add Item</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-4 text-center border ${color}`}>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MdWarning className="text-red-500 text-xl" />
            <h3 className="font-semibold text-red-700">Low Stock Alert ({lowStockItems.length} items)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <span key={item._id} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                {item.name} — {item.quantity} {item.unit} (min: {item.minQuantity})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or supplier..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="">All Categories</option>
          {INVENTORY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setViewInactive((p) => !p)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${viewInactive ? 'bg-slate-700 text-white border-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          {viewInactive ? 'Showing Inactive' : 'Show Inactive'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        {isLoading ? <Loader /> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Item</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Min Stock</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Supplier</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Cost/Unit</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const isLow = item.isActive && item.quantity <= item.minQuantity;
                return (
                  <tr key={item._id} className={`hover:bg-slate-50 transition-colors ${!item.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600">{item.category}</span></td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-slate-700'}`}>
                        {item.quantity} {item.unit}
                      </span>
                      {isLow && <MdWarning className="inline ml-1 text-red-500" />}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{item.minQuantity} {item.unit}</td>
                    <td className="px-4 py-3 text-slate-600">{item.supplier ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{item.costPerUnit ? `${item.costPerUnit} EGP` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.isActive ? (
                          <>
                            <button onClick={() => setEditTarget(item)} className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Edit"><MdEdit /></button>
                            <button onClick={() => handleDelete(item)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete"><MdDelete /></button>
                          </>
                        ) : (
                          <button onClick={() => restoreMut.mutate(item._id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" title="Restore"><MdRestore /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No items found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Inventory Item">
        <InventoryForm isLoading={createMut.isPending} onSubmit={(d) => createMut.mutate(d)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Inventory Item">
        {editTarget && (
          <InventoryForm
            defaultValues={editTarget}
            isLoading={updateMut.isPending}
            onSubmit={(d) => updateMut.mutate({ id: editTarget._id, d })}
          />
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
