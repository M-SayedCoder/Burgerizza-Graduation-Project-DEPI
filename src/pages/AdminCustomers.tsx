import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/admin-customers.css";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  status: "Active" | "Blocked";
  joinedAt: string;
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Ahmed Tarek",
    email: "ahmed@example.com",
    phone: "01012345678",
    orders: 12,
    totalSpent: 2450,
    status: "Active",
    joinedAt: "10 Jan 2026",
  },
  {
    id: 2,
    name: "Noor Samir",
    email: "noor@example.com",
    phone: "01123456789",
    orders: 8,
    totalSpent: 1720,
    status: "Active",
    joinedAt: "22 Feb 2026",
  },
  {
    id: 3,
    name: "Youssef Hassan",
    email: "youssef@example.com",
    phone: "01234567890",
    orders: 4,
    totalSpent: 890,
    status: "Blocked",
    joinedAt: "15 Mar 2026",
  },
  {
    id: 4,
    name: "Salma Reda",
    email: "salma@example.com",
    phone: "01512345678",
    orders: 17,
    totalSpent: 3680,
    status: "Active",
    joinedAt: "04 Apr 2026",
  },
];

function AdminCustomers() {
  const [customers, setCustomers] =
    useState<Customer[]>(initialCustomers);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        customer.name
          .toLowerCase()
          .includes(searchValue) ||
        customer.email
          .toLowerCase()
          .includes(searchValue) ||
        customer.phone.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const handleToggleStatus = (id: number) => {
    setCustomers((previousCustomers) =>
      previousCustomers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status:
                customer.status === "Active"
                  ? "Blocked"
                  : "Active",
            }
          : customer
      )
    );
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {
      return;
    }

    setCustomers((previousCustomers) =>
      previousCustomers.filter(
        (customer) => customer.id !== id
      )
    );
  };

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const blockedCustomers = customers.filter(
    (customer) => customer.status === "Blocked"
  ).length;

  const totalOrders = customers.reduce(
    (total, customer) => total + customer.orders,
    0
  );

  return (
    <div className="admin-customers-page">
      <div className="container py-5">

        <div className="customers-page-header mb-4">
          <div>
            <div className="customers-page-label mb-2">
              <i className="bi bi-people-fill me-2"></i>
              CUSTOMER MANAGEMENT
            </div>

            <h1 className="customers-page-title mb-2">
              Customers
            </h1>

            <p className="text-muted mb-0">
              Manage customer accounts and review their activity.
            </p>
          </div>

          <Link
            to="/"
            className="btn btn-light customers-back-button"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </Link>
        </div>

        <div className="row g-3 mb-4">

          <div className="col-sm-6 col-xl-3">
            <div className="customer-stat-card">
              <div className="customer-stat-icon total-customers-icon">
                <i className="bi bi-people-fill"></i>
              </div>

              <div>
                <span>Total Customers</span>
                <h4>{customers.length}</h4>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="customer-stat-card">
              <div className="customer-stat-icon active-customers-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>

              <div>
                <span>Active</span>
                <h4>{activeCustomers}</h4>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="customer-stat-card">
              <div className="customer-stat-icon blocked-customers-icon">
                <i className="bi bi-person-x-fill"></i>
              </div>

              <div>
                <span>Blocked</span>
                <h4>{blockedCustomers}</h4>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="customer-stat-card">
              <div className="customer-stat-icon orders-customers-icon">
                <i className="bi bi-basket-fill"></i>
              </div>

              <div>
                <span>Total Orders</span>
                <h4>{totalOrders}</h4>
              </div>
            </div>
          </div>

        </div>

        <div className="customers-filter-card mb-4">
          <div className="row g-3">

            <div className="col-lg-8">
              <div className="customers-search-box">
                <i className="bi bi-search"></i>

                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="col-lg-4">
              <select
                className="form-select customers-filter-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">
                  All Customers
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Blocked">
                  Blocked
                </option>
              </select>
            </div>

          </div>
        </div>

        <div className="customers-table-card">

          <div className="customers-table-header">
            <div>
              <h5 className="mb-1">
                All Customers
              </h5>

              <p className="text-muted mb-0">
                Showing {filteredCustomers.length} customers
              </p>
            </div>
          </div>

          <div className="table-responsive">

            <table className="table customers-table align-middle mb-0">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredCustomers.map((customer) => (

                  <tr key={customer.id}>

                    <td>
                      <div className="customer-main-info">

                        <div className="customer-list-avatar">
                          {customer.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div className="customer-list-name">
                            {customer.name}
                          </div>

                          <div className="customer-list-email">
                            {customer.email}
                          </div>
                        </div>

                      </div>
                    </td>

                    <td>{customer.phone}</td>

                    <td>{customer.orders}</td>

                    <td>
                      <strong>
                        EGP {customer.totalSpent}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`customer-status-badge ${
                          customer.status === "Active"
                            ? "customer-active"
                            : "customer-blocked"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td>{customer.joinedAt}</td>

                    <td>
                      <div className="customer-actions">

                        <button
                          type="button"
                          className="btn customer-status-action"
                          onClick={() =>
                            handleToggleStatus(customer.id)
                          }
                          title={
                            customer.status === "Active"
                              ? "Block Customer"
                              : "Activate Customer"
                          }
                        >
                          <i
                            className={`bi ${
                              customer.status === "Active"
                                ? "bi-person-slash"
                                : "bi-person-check"
                            }`}
                          ></i>
                        </button>

                        <button
                          type="button"
                          className="btn customer-delete-action"
                          onClick={() =>
                            handleDelete(customer.id)
                          }
                          title="Delete Customer"
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {filteredCustomers.length === 0 && (
            <div className="customers-empty-state">
              <i className="bi bi-people"></i>

              <h4>No customers found</h4>

              <p>
                Try changing your search or status filter.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdminCustomers;