import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getOrderById,
  updateOrderStatus,
} from "../api/ordersApi";

import type {
  Order,
  OrderStatus,
} from "../types/order";

import "../styles/order-details.css";

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
];

function OrderDetails() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Order ID is missing.");
      setLoading(false);

      return;
    }

    loadOrder(id);
  }, [id]);

  async function loadOrder(orderId: string) {
    try {
      setLoading(true);
      setError("");

      const response = await getOrderById(orderId);

      setOrder(response.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
    newStatus: OrderStatus
  ) {
    if (!order || order.status === newStatus) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const response = await updateOrderStatus(
        order._id,
        newStatus
      );
    setOrder(response.data); 
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update order status"
      );
    } finally {
      setUpdatingStatus(false);
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

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="container py-5">
          <div className="text-center py-5">
            <div
              className="spinner-border text-warning"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="text-muted mt-3">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="order-details-page">
        <div className="container py-5">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>

            {error}
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/orders")}
          >
            <i className="bi bi-arrow-left me-2"></i>

            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="order-details-page">
      <div className="container py-5">

        {/* HEADER */}

        <div className="order-details-header mb-4">
          <div>
            <div className="order-details-label mb-2">
              <i className="bi bi-receipt-cutoff me-2"></i>

              ORDER DETAILS
            </div>

            <h1 className="order-details-title mb-2">
              Order #
              {order._id.slice(-6).toUpperCase()}
            </h1>

            <p className="text-muted mb-0">
              View order information, items and status.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="btn btn-light order-back-button"
          >
            <i className="bi bi-arrow-left me-2"></i>

            Back to Orders
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            <i className="bi bi-exclamation-triangle me-2"></i>

            {error}
          </div>
        )}

        <div className="row g-4">

          {/* LEFT SIDE */}

          <div className="col-lg-8">

            {/* ORDER ITEMS */}

            <div className="order-details-card mb-4">
              <div className="order-card-header">
                <div>
                  <h5 className="mb-1">
                    Order Items
                  </h5>

                  <p className="text-muted mb-0">
                    {order.items.length} items in this order
                  </p>
                </div>

                <i className="bi bi-bag-check order-section-icon"></i>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0 order-items-table">
                  <thead>
                    <tr>
                      <th>Item</th>

                      <th>Price</th>

                      <th>Quantity</th>

                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={`${item.menuItem._id}-${index}`}>
                        <td>
                          <div className="order-item-info">
                            <div className="order-item-icon">
                              <i className="bi bi-burger"></i>
                            </div>

                            <div>
                              <div className="order-item-name">
                                {item.menuItem.name}
                              </div>

                              {item.menuItem.description && (
                                <div className="order-item-description">
                                  {item.menuItem.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          EGP {item.price.toLocaleString()}
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          <strong>
                            EGP{" "}
                            {(
                              item.price * item.quantity
                            ).toLocaleString()}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-total-section">
                <span>Total</span>

                <strong>
                  EGP {order.total.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="col-lg-4">

            {/* ORDER INFORMATION */}

            <div className="order-details-card mb-4">
              <div className="order-card-header">
                <h5 className="mb-0">
                  Order Information
                </h5>

                <i className="bi bi-info-circle order-section-icon"></i>
              </div>

              <div className="order-info-list">
                <div className="order-info-row">
                  <span>Order ID</span>

                  <strong>
                    #{order._id.slice(-6).toUpperCase()}
                  </strong>
                </div>

                <div className="order-info-row">
                  <span>Created</span>

                  <strong>
                    {formatDate(order.createdAt)}
                  </strong>
                </div>

                <div className="order-info-row">
                  <span>Status</span>

                  <span
                    className={`order-status-badge ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-info-row">
                  <span>Total</span>

                  <strong>
                    EGP {order.total.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            {/* CUSTOMER */}

            <div className="order-details-card mb-4">
              <div className="order-card-header">
                <h5 className="mb-0">
                  Customer
                </h5>

                <i className="bi bi-person order-section-icon"></i>
              </div>

              <div className="order-customer">
                <div className="order-customer-avatar">
                  {order.customer.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <div className="order-customer-name">
                    {order.customer.name}
                  </div>

                  <div className="order-customer-email">
                    {order.customer.email}
                  </div>

                  <div className="order-customer-role">
                    {order.customer.role}
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS MANAGEMENT */}

            <div className="order-details-card">
              <div className="order-card-header">
                <h5 className="mb-0">
                  Update Status
                </h5>

                <i className="bi bi-arrow-repeat order-section-icon"></i>
              </div>

              <select
                className="form-select mb-3"
                value={order.status}
                disabled={updatingStatus}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value as OrderStatus
                  )
                }
              >
                {ORDER_STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>

              <p className="text-muted small mb-0">
                {updatingStatus
                  ? "Updating order status..."
                  : "Select a new status to update the order."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;