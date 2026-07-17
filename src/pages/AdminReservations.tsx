import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getReservations,
  updateReservationStatus,
  deleteReservation,
} from "../api/reservationsApi";

import type {
  Reservation,
  ReservationStatus,
} from "../types/reservation";

import "../styles/admin-reservations.css";

const RESERVATION_STATUSES: ReservationStatus[] = [
  "Pending",
  "Confirmed",
  "Rejected",
  "Cancelled",
];

function AdminReservations() {
  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [statusFilter, setStatusFilter] =
    useState<"All" | ReservationStatus>("All");

  const [page, setPage] = useState(1);

  const [totalReservations, setTotalReservations] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingReservationId, setUpdatingReservationId] =
    useState<string | null>(null);

  const [deletingReservationId, setDeletingReservationId] =
    useState<string | null>(null);

  const limit = 10;

  useEffect(() => {
    loadReservations();
  }, [page, statusFilter]);

  async function loadReservations() {
    try {
      setLoading(true);

      setError("");

      const response =
        await getReservations({
          status:
            statusFilter === "All"
              ? undefined
              : statusFilter,

          page,

          limit,

          sort: "date",
        });

      setReservations(
        response.data.reservations
      );

      setTotalReservations(
        response.data.pagination.total
      );

      setTotalPages(
        response.data.pagination.pages
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load reservations"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
    id: string,
    status: ReservationStatus
  ) {
    try {
      setUpdatingReservationId(id);

      await updateReservationStatus(
        id,
        status
      );

      await loadReservations();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update reservation"
      );
    } finally {
      setUpdatingReservationId(null);
    }
  }

  async function handleDeleteReservation(
    id: string
  ) {
    const confirmed = window.confirm(
      "Delete this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingReservationId(id);

      await deleteReservation(id);

      await loadReservations();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete reservation"
      );
    } finally {
      setDeletingReservationId(null);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-EG",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getStatusClass(
    status: ReservationStatus
  ) {
    switch (status) {
      case "Pending":
        return "status-pending";

      case "Confirmed":
        return "status-confirmed";

      case "Rejected":
        return "status-cancelled";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "";
    }
  }

  const pendingReservations =
    reservations.filter(
      (reservation) =>
        reservation.status === "Pending"
    ).length;

  const confirmedReservations =
    reservations.filter(
      (reservation) =>
        reservation.status === "Confirmed"
    ).length;

  const cancelledReservations =
    reservations.filter(
      (reservation) =>
        reservation.status === "Cancelled"
    ).length;

  return (
    <div className="admin-reservations-page">

      <div className="container py-5">

        <div className="orders-page-header mb-4">

          <div>

            <div className="orders-page-label mb-2">

              <i className="bi bi-calendar-event me-2"></i>

              RESERVATION MANAGEMENT

            </div>

            <h1 className="orders-page-title">

              Reservations

            </h1>

            <p className="text-muted">

              Manage restaurant reservations.

            </p>

          </div>

          <Link
            to="/"
            className="btn btn-light"
          >
            <i className="bi bi-arrow-left me-2"></i>

            Dashboard

          </Link>

        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="row g-3 mb-4">

          <div className="col-md-3">

            <div className="orders-stat-card">

              <span>Total Reservations</span>

              <h4>
                {totalReservations}
              </h4>

            </div>

          </div>

          <div className="col-md-3">

            <div className="orders-stat-card">

              <span>Pending</span>

              <h4>
                {pendingReservations}
              </h4>

            </div>

          </div>

          <div className="col-md-3">

            <div className="orders-stat-card">

              <span>Confirmed</span>

              <h4>
                {confirmedReservations}
              </h4>

            </div>

          </div>

          <div className="col-md-3">

            <div className="orders-stat-card">

              <span>Cancelled</span>

              <h4>
                {cancelledReservations}
              </h4>

            </div>

          </div>

        </div>
          {/* FILTER */}

        <div className="orders-filter-card mb-4">
          <div className="row">
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target.value as
                      | "All"
                      | ReservationStatus
                  );

                  setPage(1);
                }}
              >
                <option value="All">
                  All Statuses
                </option>

                {RESERVATION_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="orders-table-card">

          <div className="orders-table-header">

            <div>

              <h5 className="mb-1">
                Reservations
              </h5>

              <p className="text-muted mb-0">
                {loading
                  ? "Loading..."
                  : `Showing ${reservations.length} of ${totalReservations} reservations`}
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

          ) : reservations.length > 0 ? (

            <div className="table-responsive">

              <table className="table orders-table align-middle mb-0">

                <thead>

                  <tr>

                    <th>Customer</th>

                    <th>Date</th>

                    <th>Time</th>

                    <th>Guests</th>

                    <th>Status</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {reservations.map(
                    (reservation) => (

                      <tr key={reservation._id}>

                        <td>

                          <div className="customer-info">

                            <div className="customer-avatar">

                              {reservation.customer.name
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div>

                              <div className="customer-name">

                                {reservation.customer.name}

                              </div>

                              <div className="customer-phone">

                                {reservation.customer.email}

                              </div>

                            </div>

                          </div>

                        </td>

                        <td>

                          {formatDate(
                            reservation.date
                          )}

                        </td>

                        <td>

                          {reservation.time}

                        </td>

                        <td>

                          {reservation.partySize}

                        </td>

                        <td>

                          <span
                            className={`order-status-badge ${getStatusClass(
                              reservation.status
                            )}`}
                          >
                            {reservation.status}
                          </span>

                        </td>

                        <td>

                          <div className="order-actions">

                            <Link
                              to={`/admin/reservations/${reservation._id}`}
                              className="btn order-view-button"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>

                            <div className="dropdown">

                              <button
                                className="btn order-status-button dropdown-toggle"
                                data-bs-toggle="dropdown"
                                disabled={
                                  updatingReservationId ===
                                  reservation._id
                                }
                              >
                                Status
                              </button>

                              <ul className="dropdown-menu dropdown-menu-end">

                                {RESERVATION_STATUSES.map(
                                  (status) => (

                                    <li key={status}>

                                      <button
                                        className={`dropdown-item ${
                                          status ===
                                          "Cancelled"
                                            ? "text-danger"
                                            : ""
                                        }`}
                                        disabled={
                                          reservation.status ===
                                          status
                                        }
                                        onClick={() =>
                                          handleStatusChange(
                                            reservation._id,
                                            status
                                          )
                                        }
                                      >
                                        {status}
                                      </button>

                                    </li>

                                  )
                                )}

                              </ul>

                            </div>

                            <button
                              className="btn btn-outline-danger"
                              disabled={
                                deletingReservationId ===
                                reservation._id
                              }
                              onClick={() =>
                                handleDeleteReservation(
                                  reservation._id
                                )
                              }
                            >
                              {deletingReservationId ===
                              reservation._id ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                <i className="bi bi-trash"></i>
                              )}
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="orders-empty-state">

              <i className="bi bi-calendar-x"></i>

              <h4>
                No reservations found
              </h4>

            </div>

          )}
                    {/* PAGINATION */}

          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between p-4 border-top">

              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={page === 1}
                onClick={() =>
                  setPage((previousPage) => previousPage - 1)
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
                  setPage((previousPage) => previousPage + 1)
                }
              >
                Next

                <i className="bi bi-chevron-right ms-2"></i>
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminReservations;      