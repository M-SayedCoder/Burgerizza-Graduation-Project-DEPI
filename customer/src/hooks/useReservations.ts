import { useState, useEffect, useCallback } from 'react';
import { reservationService } from '../services/reservationService';
import type { Reservation, BookTableRequest } from '../types/reservation.types';

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reservationService.getReservations();
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  }, []);

  const makeReservation = async (request: BookTableRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newRes = await reservationService.bookTable(request);
      setReservations((prev) => [newRes, ...prev]);
      return newRes;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to book table';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const cancelRes = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await reservationService.cancelReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel reservation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
    makeReservation,
    cancelReservation: cancelRes,
  };
};
