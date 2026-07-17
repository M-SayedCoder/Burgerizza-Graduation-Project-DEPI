import { useState } from 'react';
import { useReservations, useUpdateReservation } from '../../hooks/useReservations';
import { RESERVATION_STATUSES, ReservationStatus } from '../../constants';
import ReservationTable from '../../components/tables/ReservationTable';
import Loader from '../../components/common/Loader';

const Reservations = () => {
  const [status, setStatus] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading } = useReservations({ status });
  const reservations = data?.data ?? [];
  const updateReservation = useUpdateReservation();

  const handleUpdate = async (id: string, s: ReservationStatus) => {
    setUpdatingId(id);
    await updateReservation.mutateAsync({ id, status: s }).finally(() => setUpdatingId(null));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Reservations</h1>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Statuses</option>
          {RESERVATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        {isLoading ? <Loader /> : (
          <ReservationTable reservations={reservations} onUpdate={handleUpdate} isUpdating={updatingId} />
        )}
      </div>
    </div>
  );
};

export default Reservations;
