import type { Order } from '../../types';
import { ORDER_STATUSES } from '../../constants';
import type { OrderStatus } from '../../constants/types';
import { useNavigate } from 'react-router-dom';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Preparing: 'bg-purple-100 text-purple-700',
  Ready: 'bg-teal-100 text-teal-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

interface Props {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const OrdersTable = ({ orders, onStatusChange }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-4 py-3 text-left font-medium text-slate-600">Order #</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Customer</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Items</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Total</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-slate-500">#{order._id.slice(-6).toUpperCase()}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{order.customer?.name ?? 'N/A'}</td>
              <td className="px-4 py-3 text-slate-600">{order.items?.length ?? 0} items</td>
              <td className="px-4 py-3 text-slate-700">{order.total} EGP</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value as OrderStatus)}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="text-xs text-orange-500 hover:text-orange-700 underline"
                  >Details</button>
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No orders found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
