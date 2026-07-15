import { useEffect, useState } from "react";


import AdminHeader from "../components/AdminHeader";
import MetricCard from "../components/MetricCard";
import RecentOrders from "../components/RecentOrders";
import DailyStatsChart from "../components/DailyStatsChart";

import { getAdminDashboard } from "../api/adminApi";

import type { AdminDashboardData } from "../types/admin";

import "../styles/admin-dashboard.css";

function AdminDashboard() {
  const [dashboardData, setDashboardData] =
    useState<AdminDashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        setError("");

        const response = await getAdminDashboard();

        setDashboardData(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const metrics = [
    {
      label: "Total Orders",

      value: loading
        ? "..."
        : dashboardData?.totalOrders.toLocaleString() ?? "0",

      description: "All restaurant orders",

      icon: "bi-basket2-fill",

      color: "primary",
    },

    {
      label: "Revenue",

      value: loading
        ? "..."
        : `EGP ${
            dashboardData?.totalRevenue.toLocaleString() ?? "0"
          }`,

      description: "Revenue from valid orders",

      icon: "bi-currency-dollar",

      color: "success",
    },

    {
      label: "Pending Orders",

      value: loading
        ? "..."
        : dashboardData?.pendingOrders.toLocaleString() ?? "0",

      description: "Orders waiting for confirmation",

      icon: "bi-hourglass-split",

      color: "warning",
    },

    {
      label: "Reservations",

      value: loading
        ? "..."
        : dashboardData?.totalReservations.toLocaleString() ?? "0",

      description: "Total reservations",

      icon: "bi-calendar-check-fill",

      color: "danger",
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* ADMIN HEADER */}

      <AdminHeader />

      <main className="container py-5">
        {/* PAGE HEADER */}

        <div className="row g-4 mb-4 align-items-center">
          <div className="col-md-8">
            <h1 className="dashboard-title fw-semibold mb-2">
              Admin Dashboard
            </h1>

            <p className="text-muted mb-0">
              Overview of orders, reservations, and restaurant performance.
            </p>
          </div>
          </div>


        {/* DASHBOARD ERROR */}

        {error && (
          <div
            className="alert alert-danger mb-4"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle me-2"></i>

            {error}
          </div>
        )}

        {/* DASHBOARD METRICS */}

        <section className="dashboard-overview mb-5">
          <div className="row g-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="col-sm-6 col-xl-3"
              >
                <MetricCard {...metric} />
              </div>
            ))}
          </div>
        </section>

        {/* LAST 7 DAYS STATISTICS */}

        <section className="dashboard-stats mb-5">
          <DailyStatsChart />
        </section>

        {/* RECENT ORDERS */}

        <section className="dashboard-recent-orders"> 
          <RecentOrders />
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;