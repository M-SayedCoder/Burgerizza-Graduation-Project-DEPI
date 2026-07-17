import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '../services/menuService';
import toast from 'react-hot-toast';

interface MenuFilters { page?: number; search?: string; category?: string; sort?: string; }

export const useMenu = (filters?: MenuFilters) =>
  useQuery({
    queryKey: ['menu', filters],
    queryFn: () => menuService.getAll(filters ?? {}),
  });

export const useCreateMenu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => menuService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['menu'] }); toast.success('Meal added!'); },
    onError: () => toast.error('Failed to add meal'),
  });
};

export const useUpdateMenu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => menuService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['menu'] }); toast.success('Meal updated!'); },
    onError: () => toast.error('Failed to update meal'),
  });
};

export const useDeleteMenu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['menu'] }); toast.success('Meal deleted!'); },
    onError: () => toast.error('Failed to delete meal'),
  });
};

export const useToggleAvailability = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuService.toggleAvailability(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['menu'] }); toast.success('Availability updated!'); },
    onError: () => toast.error('Failed to update'),
  });
};
