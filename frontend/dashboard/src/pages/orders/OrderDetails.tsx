import { useParams, useNavigate } from 'react-router-dom';
import { useOrderById, useUpdateOrderStatus } from '../../hooks/useOrders';
import { ORDER_STATUSES, OrderStatus } from '../../constants';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Preparing: 'bg-purple-100 text-purple-700',
  Ready: 'bg-teal-100 text-teal-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrderById(id!);
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) return <Loader />;
  if (!order) return <div className="text-center py-20 text-slate-400">Order not found.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/orders')}>← Back</Button>
        <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">#{order._id}</p>
            <h2 className="text-lg font-semibold text-slate-800 mt-1">{order.customer?.name ?? 'N/A'}</h2>
            <p className="text-sm text-slate-500">{order.customer?.phone ?? '—'}</p>
            {order.customer?.address && <p className="text-sm text-slate-500">{order.customer.address}</p>}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] ?? 'bg-slate-100 text-slate-600'}`}>
            {order.status}
          </span>
        </div>

        <div>
          <h3 className="font-semibold text-slate-700 mb-3">Items</h3>
          <div className="divide-y divide-slate-100">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-slate-700">{item.price * item.quantity} EGP</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 mt-2">
            <span className="font-semibold text-slate-800">Total</span>
            <span className="font-bold text-orange-500 text-lg">{order.total} EGP</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-700 mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                disabled={order.status === s || updateStatus.isPending}
                onClick={() => updateStatus.mutate({ id: order._id, status: s as OrderStatus })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  order.status === s ? 'bg-orange-500 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
