import { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import { ORDER_STATUSES, OrderStatus } from '../../constants';
import OrdersTable from '../../components/tables/OrdersTable';
import SearchInput from '../../components/common/SearchInput';
import Loader from '../../components/common/Loader';

const Orders = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useOrders({ search, status });
  const orders = data?.data ?? [];
  const updateStatus = useUpdateOrderStatus();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Orders Management</h1>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by customer..." />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        {isLoading ? <Loader /> : (
          <OrdersTable
            orders={orders}
            onStatusChange={(id, s) => updateStatus.mutate({ id, status: s as OrderStatus })}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
