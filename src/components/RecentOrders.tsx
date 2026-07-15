import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getOrdersSummary } from "../api/adminApi";
import type { LatestOrder } from "../types/admin";

function getBadgeColor(status: string) {
  switch (status) {
    case "Delivered":
      return "success";

    case "Confirmed":
      return "primary";

    case "Preparing":
      return "warning";

    case "Ready":
      return "info";

    case "Pending":
      return "secondary";

    case "Cancelled":
      return "danger";

    default:
      return "secondary";
  }
}

function RecentOrders() {
  const [orders, setOrders] = useState<LatestOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecentOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await getOrdersSummary();

        setOrders(response.data.latestOrders);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load recent orders"
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecentOrders();
  }, []);

  return (
    <div className="dashboard-card p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="mb-1">
            Recent Orders
          </h5>

          <p className="text-muted mb-0">
            Latest orders from the restaurant
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="text-decoration-none"
        >
          See all
        </Link>
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
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center text-muted py-5">
          No recent orders found.
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const badge = getBadgeColor(order.status);

                return (
                  <tr key={order._id}>
                    <td>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td>
                      <div className="fw-semibold">
                        {order.customer.name}
                      </div>

                      <small className="text-muted">
                        {order.customer.email}
                      </small>
                    </td>

                    <td>
                      <span
                        className={`badge bg-${badge} ${
                          badge === "warning" ||
                          badge === "info"
                            ? "text-dark"
                            : ""
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      EGP {order.total.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentOrders;