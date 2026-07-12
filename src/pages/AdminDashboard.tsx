import AdminHeader from "../components/AdminHeader";
import MetricCard from "../components/MetricCard";
import RecentOrders from "../components/RecentOrders";
import QuickActions from "../components/QuickActions";
import "../styles/admin-dashboard.css";

const metrics = [
  {
    label: "Total Orders",
    value: "1,248",
    description: "Delivered and in progress",
    icon: "bi-basket2-fill",
    color: "primary",
  },
  {
    label: "Revenue",
    value: "EGP 76,500",
    description: "Last 30 days",
    icon: "bi-currency-dollar",
    color: "success",
  },
  {
    label: "Active Customers",
    value: "3,952",
    description: "Registered users",
    icon: "bi-people-fill",
    color: "warning",
  },
  {
    label: "Open Tickets",
    value: "12",
    description: "Needs attention",
    icon: "bi-exclamation-circle-fill",
    color: "danger",
  },
];

function AdminDashboard() {
  return (
    <div className="admin-dashboard">

      <AdminHeader />

      <main className="container py-5">

        <div className="row g-4 mb-4 align-items-center">

          <div className="col-md-8">

            <h1 className="dashboard-title fw-semibold mb-2">
              Admin Dashboard
            </h1>

            <p className="text-muted mb-0">
              Overview of orders, customers, and restaurant performance.
            </p>

          </div>

          <div className="col-md-4 text-md-end">

            <a
             href="/menu"
              className="btn btn-outline-secondary"
            >
              View Menu
            </a>

          </div>

        </div>

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

        <section className="dashboard-content mb-5">

          <div className="row g-4">

            <div className="col-lg-7">
              <RecentOrders />
            </div>

            <div className="col-lg-5">
              <QuickActions />
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;