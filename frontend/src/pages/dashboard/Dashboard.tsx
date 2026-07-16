import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MdReceipt, MdEventSeat, MdAttachMoney, MdTrendingUp, MdWarning } from 'react-icons/md';
import { adminService } from '../../services/adminService';
import { useOrders } from '../../hooks/useOrders';
import Loader from '../../components/common/Loader';

const StatCard = ({
  label, value, sub, icon: Icon, color,
}: { label: string; value: string | number; sub?: string; icon: React.ElementType; color: string }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="text-2xl text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const statusColors: Record<string, string> = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Preparing: 'bg-purple-100 text-purple-700',
  Ready:     'bg-teal-100 text-teal-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const Dashboard = () => {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn:  () => adminService.getStats(),
    staleTime: 60_000,
  });

  // Recent orders — still useful for the table regardless of mock/real
  const { data: ordersData, isLoading: loadingOrders } = useOrders({ limit: 5 });
  const recentOrders = ordersData?.data ?? [];

  if (loadingStats) return <Loader text="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Good day, Manager 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening at Burgerizza today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Today's Orders"      value={stats?.todayOrders ?? 0}       sub={`${stats?.totalOrders ?? 0} total`}      icon={MdReceipt}    color="bg-blue-500" />
        <StatCard label="Pending Orders"      value={stats?.pendingOrders ?? 0}      sub="Needs attention"                          icon={MdWarning}    color="bg-orange-500" />
        <StatCard label="Today's Revenue"     value={`${(stats?.todayRevenue ?? 0).toLocaleString()} EGP`}  sub={`${(stats?.totalRevenue ?? 0).toLocaleString()} EGP total`} icon={MdAttachMoney} color="bg-emerald-500" />
        <StatCard label="Reservations Today"  value={stats?.todayReservations ?? 0}  sub={`${stats?.pendingReservations ?? 0} pending`} icon={MdEventSeat}  color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Recent Orders</h3>
            <Link to="/orders" className="text-xs text-orange-500 hover:underline">View all →</Link>
          </div>
          {loadingOrders ? <Loader /> : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o._id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{o.customer?.name ?? 'N/A'}</p>
                    <p className="text-xs text-slate-400">{o.total} EGP · {o.items?.length ?? 0} items</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[o.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {o.status}
                  </span>
                </div>
              ))}
              {recentOrders.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No orders yet.</p>}
            </div>
          )}
        </div>

        {/* Revenue Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MdTrendingUp className="text-emerald-500" /> Revenue Summary
          </h3>
          <div className="space-y-4">
            <div className="text-center py-4 bg-emerald-50 rounded-xl">
              <p className="text-3xl font-bold text-emerald-600">{(stats?.todayRevenue ?? 0).toLocaleString()}</p>
              <p className="text-sm text-emerald-500 mt-1">EGP Today</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-bold text-slate-800">{stats?.completedOrders ?? 0}</p>
                <p className="text-xs text-slate-500">Delivered</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-bold text-slate-800">{(stats?.totalRevenue ?? 0).toLocaleString()}</p>
                <p className="text-xs text-slate-500">EGP Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
