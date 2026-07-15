import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getAdminStats } from "../api/adminApi";

import type { DailyStat } from "../types/admin";

function DailyStatsChart() {
  const [stats, setStats] = useState<DailyStat[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminStats();

        setStats(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard statistics"
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const chartData = stats.map((stat) => ({
    date: new Date(stat._id).toLocaleDateString("en-EG", {
      day: "2-digit",
      month: "short",
    }),

    revenue: stat.revenue,

    ordersCount: stat.ordersCount,
  }));

  return (
    <div className="dashboard-card p-4 h-100">
      <div className="mb-4">
        <h5 className="mb-1">
          Last 7 Days Performance
        </h5>

        <p className="text-muted mb-0">
          Daily revenue and order activity.
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div
            className="spinner-border text-warning"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && !error && chartData.length === 0 && (
        <div className="text-center text-muted py-5">
          No statistics available for the last 7 days.
        </div>
      )}

      {!loading && !error && chartData.length > 0 && (
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis yAxisId="revenue" />

              <YAxis
                yAxisId="orders"
                orientation="right"
                allowDecimals={false}
              />

              <Tooltip />

              <Legend />

              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue (EGP)"
                stroke="#198754"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />

              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="ordersCount"
                name="Orders"
                stroke="#ff7a00"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default DailyStatsChart;