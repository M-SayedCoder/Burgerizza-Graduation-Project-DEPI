import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { adminService } from '../../services/adminService';
import Loader from '../common/Loader';

const DailyStatsChart = () => {
  const { data: stats = [], isLoading, error } = useQuery({
    queryKey: ['admin-daily-stats'],
    queryFn: () => adminService.getDailyStats(),
    staleTime: 60_000,
  });

  const chartData = stats.map((stat) => ({
    date: new Date(stat._id).toLocaleDateString('en-EG', {
      day: '2-digit',
      month: 'short',
    }),
    revenue: stat.revenue,
    ordersCount: stat.ordersCount,
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Last 7 Days Performance</h3>
        <p className="text-slate-400 text-sm mt-1">Daily revenue and order activity.</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader text="Loading performance stats..." />
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
          {error instanceof Error ? error.message : 'Failed to load dashboard statistics'}
        </div>
      )}

      {!isLoading && !error && chartData.length === 0 && (
        <p className="text-center text-slate-400 py-12 text-sm">No statistics available for the last 7 days.</p>
      )}

      {!isLoading && !error && chartData.length > 0 && (
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis yAxisId="revenue" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                yAxisId="orders"
                orientation="right"
                allowDecimals={false}
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue (EGP)"
                stroke="#10b981"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="ordersCount"
                name="Orders"
                stroke="#f97316"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DailyStatsChart;
