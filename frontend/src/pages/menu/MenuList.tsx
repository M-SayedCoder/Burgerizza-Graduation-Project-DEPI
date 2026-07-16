import { useState } from 'react';
import { useMenu, useCreateMenu, useUpdateMenu, useDeleteMenu, useToggleAvailability } from '../../hooks/useMenu';
import { Menu } from '../../types';
import { CATEGORIES } from '../../constants';
import MenuTable from '../../components/tables/MenuTable';
import Modal from '../../components/common/Modal';
import MenuForm from '../../components/forms/MenuForm';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const MenuList = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editTarget, setEditTarget] = useState<Menu | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useMenu({ search, category });
  const meals = data?.data ?? [];

  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const deleteMenu = useDeleteMenu();
  const toggleAvailability = useToggleAvailability();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteMenu.mutateAsync(id).finally(() => setDeletingId(null));
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    await toggleAvailability.mutateAsync(id).finally(() => setTogglingId(null));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Menu Management</h1>
        <Button onClick={() => setShowAdd(true)}>+ Add New Meal</Button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search meals..." />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || category) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setCategory(''); }}>Clear</Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        {isLoading ? <Loader /> : (
          <MenuTable
            meals={meals}
            onEdit={setEditTarget}
            onDelete={handleDelete}
            onToggle={handleToggle}
            isToggling={togglingId}
            isDeleting={deletingId}
          />
        )}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Meal">
        <MenuForm
          isLoading={createMenu.isPending}
          onSubmit={async (fd) => { await createMenu.mutateAsync(fd); setShowAdd(false); }}
        />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Meal">
        {editTarget && (
          <MenuForm
            defaultValues={editTarget}
            isLoading={updateMenu.isPending}
            onSubmit={async (fd) => { await updateMenu.mutateAsync({ id: editTarget._id, data: fd }); setEditTarget(null); }}
          />
        )}
      </Modal>
    </div>
  );
};

export default MenuList;
