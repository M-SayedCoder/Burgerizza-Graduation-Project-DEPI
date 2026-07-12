import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/admin-orders.css";

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "On the way"
  | "Delivered"
  | "Cancelled";

interface Order {
  id: string;
  customer: string;
  phone: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
}

const initialOrders: Order[] = [
  {
    id: "#A124",
    customer: "Ahmed T.",
    phone: "01012345678",
    items: 3,
    total: 310,
    status: "Delivered",
    date: "10 Jul 2026, 12:30 PM",
  },
  {
    id: "#A125",
    customer: "Noor S.",
    phone: "01123456789",
    items: 2,
    total: 245,
    status: "Preparing",
    date: "10 Jul 2026, 01:15 PM",
  },
  {
    id: "#A126",
    customer: "Youssef H.",
    phone: "01234567890",
    items: 4,
    total: 420,
    status: "On the way",
    date: "10 Jul 2026, 02:00 PM",
  },
  {
    id: "#A127",
    customer: "Salma R.",
    phone: "01512345678",
    items: 1,
    total: 180,
    status: "Pending",
    date: "10 Jul 2026, 02:45 PM",
  },
  {
    id: "#A128",
    customer: "Omar M.",
    phone: "01098765432",
    items: 2,
    total: 290,
    status: "Cancelled",
    date: "10 Jul 2026, 03:20 PM",
  },
];

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue) ||
        order.phone.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const updateOrderStatus = (
    id: string,
    newStatus: OrderStatus
  ) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === id
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );
  };

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "status-pending";

      case "Preparing":
        return "status-preparing";

      case "On the way":
        return "status-on-the-way";

      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "";
    }
  };

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

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


        {/* STATISTICS */}

        <div className="row g-3 mb-4">

          <div className="col-sm-6 col-xl-3">

            <div className="orders-stat-card">

              <div className="orders-stat-icon total-orders-icon">

                <i className="bi bi-basket2-fill"></i>

              </div>

              <div>

                <span>Total Orders</span>

                <h4>{orders.length}</h4>

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

                <h4>{pendingOrders}</h4>

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

                <h4>{preparingOrders}</h4>

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

                <h4>{deliveredOrders}</h4>

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
                  placeholder="Search by order ID, customer or phone..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

              </div>

            </div>


            <div className="col-lg-4">

              <select
                className="form-select orders-filter-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >

                <option value="All">
                  All Statuses
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Preparing">
                  Preparing
                </option>

                <option value="On the way">
                  On the way
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

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
                Showing {filteredOrders.length} orders
              </p>

            </div>

          </div>


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

                {filteredOrders.map((order) => (

                  <tr key={order.id}>

                    <td>

                      <span className="order-id">
                        {order.id}
                      </span>

                    </td>


                    <td>

                      <div className="customer-info">

                        <div className="customer-avatar">

                          {order.customer
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                        <div>

                          <div className="customer-name">

                            {order.customer}

                          </div>

                          <div className="customer-phone">

                            {order.phone}

                          </div>

                        </div>

                      </div>

                    </td>


                    <td>

                      {order.items} items

                    </td>


                    <td>

                      <span className="order-total">

                        EGP {order.total}

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

                        {order.date}

                      </span>

                    </td>


                    <td>

                      <div className="order-actions">

                        <Link
                          to={`/orders/${order.id.replace("#", "")}`}
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
                          >

                            Status

                          </button>


                          <ul className="dropdown-menu dropdown-menu-end">

                            <li>

                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id,
                                    "Pending"
                                  )
                                }
                              >

                                Pending

                              </button>

                            </li>


                            <li>

                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id,
                                    "Preparing"
                                  )
                                }
                              >

                                Preparing

                              </button>

                            </li>


                            <li>

                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id,
                                    "On the way"
                                  )
                                }
                              >

                                On the way

                              </button>

                            </li>


                            <li>

                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id,
                                    "Delivered"
                                  )
                                }
                              >

                                Delivered

                              </button>

                            </li>


                            <li>

                              <hr className="dropdown-divider" />

                            </li>


                            <li>

                              <button
                                className="dropdown-item text-danger"
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id,
                                    "Cancelled"
                                  )
                                }
                              >

                                Cancelled

                              </button>

                            </li>

                          </ul>

                        </div>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {filteredOrders.length === 0 && (

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