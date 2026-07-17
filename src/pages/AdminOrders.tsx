import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getOrders,
  updateOrderStatus as updateOrderStatusApi,
  deleteOrder as deleteOrderApi,
} from "../api/ordersApi";

import { getOrdersSummary } from "../api/adminApi";

import type {
  Order,
  OrderStatus,
} from "../types/order";

import type { OrderStatusCounts } from "../types/admin";

import "../styles/admin-orders.css";

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"All" | OrderStatus>("All");

  const [page, setPage] = useState(1);

  const [totalOrders, setTotalOrders] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [statusCounts, setStatusCounts] =
    useState<OrderStatusCounts>({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingOrderId, setUpdatingOrderId] =
    useState<string | null>(null);

  const [deletingOrderId, setDeletingOrderId] =
    useState<string | null>(null);

  const limit = 10;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadOrders();
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search, statusFilter, page]);

  useEffect(() => {
    loadOrdersSummary();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders({
        search: search.trim() || undefined,

        status:
          statusFilter === "All"
            ? undefined
            : statusFilter,

        page,

        limit,

        sort: "-createdAt",
      });

      setOrders(response.data.orders);

      setTotalOrders(response.data.pagination.total);

      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadOrdersSummary() {
    try {
      const response = await getOrdersSummary();

      setStatusCounts(response.data.statusCounts);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load orders statistics"
      );
    }
  }

  async function handleStatusChange(
    id: string,
    newStatus: OrderStatus
  ) {
    try {
      setUpdatingOrderId(id);
      setError("");

      const response = await updateOrderStatusApi(
        id,
        newStatus
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === id
            ? response.data
            : order
        )
      );

      await loadOrdersSummary();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleDeleteOrder(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingOrderId(id);
      setError("");

      await deleteOrderApi(id);

      await Promise.all([
        loadOrders(),
        loadOrdersSummary(),
      ]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete order"
      );
    } finally {
      setDeletingOrderId(null);
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value);

    setPage(1);
  }

  function handleStatusFilterChange(
    value: "All" | OrderStatus
  ) {
    setStatusFilter(value);

    setPage(1);
  }

  function getStatusClass(status: OrderStatus) {
    switch (status) {
      case "Pending":
        return "status-pending";

      case "Confirmed":
        return "status-confirmed";

      case "Preparing":
        return "status-preparing";

      case "Ready":
        return "status-ready";

      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-EG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="admin-orders-page">
      <div className="container py-5">

        {/* HEADER */}

        <div className="orders-page-header mb-4">
          <div>
            <div className="orders-page-label mb-2">
              <i className="bi bi-receipt me-2"></i>

              ORDER MANAGEMENT
            </div>

            <h1 className="orders-page-title mb-2">
              Orders
            </h1>

            <p className="text-muted mb-0">
              Track customer orders and update their status.
            </p>
          </div>

          <Link
            to="/"
            className="btn btn-light orders-back-button"
          >
            <i className="bi bi-arrow-left me-2"></i>

            Dashboard
          </Link>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="alert alert-danger mb-4"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle me-2"></i>

            {error}
          </div>
        )}

        {/* STATISTICS */}

        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="orders-stat-card">
              <div className="orders-stat-icon total-orders-icon">
                <i className="bi bi-basket2-fill"></i>
              </div>

              <div>
                <span>Total Orders</span>

                <h4>{totalOrders}</h4>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="orders-stat-card">
              <div className="orders-stat-icon pending-orders-icon">
                <i className="bi bi-clock-fill"></i>
              </div>

              <div>
                <span>Pending</span>

                <h4>
                  {statusCounts.Pending ?? 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="orders-stat-card">
              <div className="orders-stat-icon preparing-orders-icon">
                <i className="bi bi-fire"></i>
              </div>

              <div>
                <span>Preparing</span>

                <h4>
                  {statusCounts.Preparing ?? 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="orders-stat-card">
              <div className="orders-stat-icon delivered-orders-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>

              <div>
                <span>Delivered</span>

                <h4>
                  {statusCounts.Delivered ?? 0}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}

        <div className="orders-filter-card mb-4">
          <div className="row g-3">
            <div className="col-lg-8">
              <div className="orders-search-box">
                <i className="bi bi-search"></i>

                <input
                  type="text"
                  placeholder="Search by order ID or customer name..."
                  value={search}
                  onChange={(event) =>
                    handleSearchChange(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="col-lg-4">
              <select
                className="form-select orders-filter-select"
                value={statusFilter}
                onChange={(event) =>
                  handleStatusFilterChange(
                    event.target.value as
                      | "All"
                      | OrderStatus
                  )
                }
              >
                <option value="All">
                  All Statuses
                </option>

                {ORDER_STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ORDERS TABLE */}

        <div className="orders-table-card">
          <div className="orders-table-header">
            <div>
              <h5 className="mb-1">
                All Orders
              </h5>

              <p className="text-muted mb-0">
                {loading
                  ? "Loading orders..."
                  : `Showing ${orders.length} of ${totalOrders} orders`}
              </p>
            </div>
          </div>

          {loading ? (
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
          ) : orders.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table orders-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Order</th>

                      <th>Customer</th>

                      <th>Items</th>

                      <th>Total</th>

                      <th>Status</th>

                      <th>Date</th>

                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="order-id">
                            #
                            {order._id
                              .slice(-6)
                              .toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <div className="customer-info">
                            <div className="customer-avatar">
                              {order.customer.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <div className="customer-name">
                                {order.customer.name}
                              </div>

                              <div className="customer-phone">
                                {order.customer.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          {order.items.length} items
                        </td>

                        <td>
                          <span className="order-total">
                            EGP{" "}
                            {order.total.toLocaleString()}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`order-status-badge ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td>
                          <span className="order-date">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>

                        <td>
                          <div className="order-actions">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="btn order-view-button"
                              title="View Order"
                            > 
                              <i className="bi bi-eye"></i>
                            </Link>

                            <div className="dropdown">
                              <button
                                className="btn order-status-button dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                disabled={
                                  updatingOrderId === order._id
                                }
                              >
                                {updatingOrderId === order._id
                                  ? "Updating..."
                                  : "Status"}
                              </button>

                              <ul className="dropdown-menu dropdown-menu-end">
                                {ORDER_STATUSES.map((status) => (
                                  <li key={status}>
                                    <button
                                      className={`dropdown-item ${
                                        status === "Cancelled"
                                          ? "text-danger"
                                          : ""
                                      }`}
                                      disabled={
                                        order.status === status
                                      }
                                      onClick={() =>
                                        handleStatusChange(
                                          order._id,
                                          status
                                        )
                                      }
                                    >
                                      {status}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              title="Delete Order"
                              disabled={
                                deletingOrderId === order._id
                              }
                              onClick={() =>
                                handleDeleteOrder(order._id)
                              }
                            >
                              {deletingOrderId === order._id ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                <i className="bi bi-trash"></i>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (
                <div className="d-flex align-items-center justify-content-between p-4 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled={page === 1}
                    onClick={() =>
                      setPage((previousPage) =>
                        previousPage - 1
                      )
                    }
                  >
                    <i className="bi bi-chevron-left me-2"></i>

                    Previous
                  </button>

                  <span className="text-muted">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((previousPage) =>
                        previousPage + 1
                      )
                    }
                  >
                    Next

                    <i className="bi bi-chevron-right ms-2"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="orders-empty-state">
              <i className="bi bi-receipt"></i>

              <h4>No orders found</h4>

              <p>
                Try changing the search or status filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;