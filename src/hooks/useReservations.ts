import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '../services/reservationService';
import { ReservationStatus } from '../constants';
import toast from 'react-hot-toast';

interface ReservationFilters { page?: number; status?: string; }

export const useReservations = (filters?: ReservationFilters) =>
  useQuery({
    queryKey: ['reservations', filters],
    queryFn: () => reservationService.getAll(filters ?? {}),
  });

export const useUpdateReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReservationStatus }) =>
      reservationService.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['reservations'] }); toast.success('Reservation updated!'); },
    onError: () => toast.error('Failed to update reservation'),
  });
};
