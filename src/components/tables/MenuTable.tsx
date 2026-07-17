import { Menu } from '../../types';
import { showDeleteDialog } from '../common/ConfirmDialog';
import Button from '../common/Button';

interface Props {
  meals: Menu[];
  onEdit: (meal: Menu) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isToggling?: string | null;
  isDeleting?: string | null;
}

const MenuTable = ({ meals, onEdit, onDelete, onToggle, isToggling, isDeleting }: Props) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-4 py-3 text-left font-medium text-slate-600">Image</th>
          <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
          <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
          <th className="px-4 py-3 text-left font-medium text-slate-600">Price</th>
          <th className="px-4 py-3 text-left font-medium text-slate-600">Availability</th>
          <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {meals.map((meal) => (
          <tr key={meal._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-100"
              />
            </td>
            <td className="px-4 py-3 font-medium text-slate-800">{meal.name}</td>
            <td className="px-4 py-3">
              <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                {meal.category}
              </span>
            </td>
            <td className="px-4 py-3 text-slate-700">{meal.price} EGP</td>
            <td className="px-4 py-3">
              <button
                onClick={() => onToggle(meal._id)}
                disabled={isToggling === meal._id}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  meal.isAvailable
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {isToggling === meal._id ? '...' : meal.isAvailable ? 'Available' : 'Out of Stock'}
              </button>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(meal)}>Edit</Button>
                <Button
                  size="sm"
                  variant="danger"
                  isLoading={isDeleting === meal._id}
                  onClick={() => showDeleteDialog(() => onDelete(meal._id))}
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
        {meals.length === 0 && (
          <tr>
            <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
              No menu items found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default MenuTable;
