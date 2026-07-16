import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { OrderStatus } from '../constants';
import toast from 'react-hot-toast';

interface OrderFilters { page?: number; limit?: number; search?: string; status?: string; }


export const useOrders = (filters?: OrderFilters) =>
  useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.getAll(filters ?? {}),
  });

export const useOrderById = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); toast.success('Status updated!'); },
    onError: () => toast.error('Failed to update status'),
  });
};
