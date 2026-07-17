import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CATEGORIES } from '../../constants';
import { Menu } from '../../types';
import Button from '../common/Button';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.coerce.number().min(1, 'Price must be > 0'),
  category: z.enum(CATEGORIES),
  isAvailable: z.boolean(),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Menu>;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

const MenuForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      price: defaultValues?.price ?? 0,
      category: defaultValues?.category ?? CATEGORIES[0],
      isAvailable: defaultValues?.isAvailable ?? true,
    },
  });

  const submit = (vals: FormValues) => {
    const fd = new FormData();
    fd.append('name', vals.name);
    fd.append('description', vals.description);
    fd.append('price', String(vals.price));
    fd.append('category', vals.category);
    fd.append('isAvailable', String(vals.isAvailable));
    if (vals.image?.[0]) fd.append('image', vals.image[0]);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit((data) => submit(data))} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input
          {...register('name')}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price (EGP)</label>
          <input
            type="number"
            {...register('price')}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            {...register('category')}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          {...register('image')}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isAvailable"
          {...register('isAvailable')}
          className="w-4 h-4 accent-orange-500"
        />
        <label htmlFor="isAvailable" className="text-sm font-medium text-slate-700">Available</label>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        {defaultValues ? 'Update Meal' : 'Add Meal'}
      </Button>
    </form>
  );
};

export default MenuForm;
