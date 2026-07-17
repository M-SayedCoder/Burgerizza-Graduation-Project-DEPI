import { Reservation } from '../../types';
import { ReservationStatus } from '../../constants';
import Button from '../common/Button';
import Swal from 'sweetalert2';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
  Cancelled: 'bg-slate-100 text-slate-600',
};

interface Props {
  reservations: Reservation[];
  onUpdate: (id: string, status: ReservationStatus) => void;
  isUpdating?: string | null;
}

const ReservationTable = ({ reservations, onUpdate, isUpdating }: Props) => {
  const confirm = async (id: string, status: ReservationStatus, label: string) => {
    const result = await Swal.fire({
      title: `${label} Reservation?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#64748b',
      confirmButtonText: label,
    });
    if (result.isConfirmed) onUpdate(id, status);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-4 py-3 text-left font-medium text-slate-600">Customer</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Phone</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Time</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Guests</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reservations.map((res) => (
            <tr key={res._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-800">{res.customer?.name ?? 'N/A'}</td>
              <td className="px-4 py-3 text-slate-600">{res.customer?.phone ?? '—'}</td>
              <td className="px-4 py-3 text-slate-600">{res.date}</td>
              <td className="px-4 py-3 text-slate-600">{res.time}</td>
              <td className="px-4 py-3 text-slate-600">{res.partySize} pax</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[res.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {res.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {res.status === 'Pending' ? (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="success" isLoading={isUpdating === res._id}
                      onClick={() => confirm(res._id, 'Confirmed', 'Confirm')}>Confirm</Button>
                    <Button size="sm" variant="danger" isLoading={isUpdating === res._id}
                      onClick={() => confirm(res._id, 'Rejected', 'Reject')}>Reject</Button>
                  </div>
                ) : <span className="text-slate-400 text-xs">—</span>}
              </td>
            </tr>
          ))}
          {reservations.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No reservations found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
