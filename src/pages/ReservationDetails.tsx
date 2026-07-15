import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getReservationById,
  updateReservationStatus,
} from "../api/reservationsApi";

import type {
  Reservation,
  ReservationStatus,
} from "../types/reservation";

import "../styles/reservation-details.css";

const RESERVATION_STATUSES: ReservationStatus[] = [
  "Pending",
  "Confirmed",
  "Rejected",
  "Cancelled",
];

function ReservationDetails() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [reservation, setReservation] =
    useState<Reservation | null>(null);

  const [loading, setLoading] = useState(true);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Reservation ID is missing.");
      setLoading(false);

      return;
    }

    loadReservation(id);
  }, [id]);

  async function loadReservation(
    reservationId: string
  ) {
    try {
      setLoading(true);

      setError("");

      const response =
        await getReservationById(
          reservationId
        );

      setReservation(response.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load reservation"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
    newStatus: ReservationStatus
  ) {
    if (
      !reservation ||
      reservation.status === newStatus
    ) {
      return;
    }

    try {
      setUpdatingStatus(true);

      setError("");

      await updateReservationStatus(
        reservation._id,
        newStatus
      );

      await loadReservation(
        reservation._id
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update reservation status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-EG",
      {
        day: "2-digit",
        month: "long",
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

  if (loading) {
    return (
      <div className="reservation-details-page">
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

            <p className="mt-3 text-muted">
              Loading reservation...
            </p>

          </div>

        </div>
      </div>
    );
  }

  if (error && !reservation) {
    return (
      <div className="reservation-details-page">
        <div className="container py-5">

          <div className="alert alert-danger">
            {error}
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              navigate("/admin/reservations")
            }
          >
            <i className="bi bi-arrow-left me-2"></i>

            Back to Reservations

          </button>

        </div>
      </div>
    );
  }

  if (!reservation) {
    return null;
  }
    return (
    <div className="reservation-details-page">
      <div className="container py-5">

        {/* HEADER */}

        <div className="order-details-header mb-4">

          <div>

            <div className="order-details-label mb-2">

              <i className="bi bi-calendar-check me-2"></i>

              RESERVATION DETAILS

            </div>

            <h1 className="order-details-title mb-2">

              Reservation #
              {reservation._id.slice(-6).toUpperCase()}

            </h1>

            <p className="text-muted mb-0">

              View reservation details and update its status.

            </p>

          </div>

          <Link
            to="/admin/reservations"
            className="btn btn-light order-back-button"
          >

            <i className="bi bi-arrow-left me-2"></i>

            Back to Reservations

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

            <div className="order-details-card">

              <div className="order-card-header">

                <h5 className="mb-0">

                  Reservation Information

                </h5>

                <i className="bi bi-calendar-event order-section-icon"></i>

              </div>

              <div className="order-info-list">

                <div className="order-info-row">

                  <span>Date</span>

                  <strong>
                    {formatDate(reservation.date)}
                  </strong>

                </div>

                <div className="order-info-row">

                  <span>Time</span>

                  <strong>
                    {reservation.time}
                  </strong>

                </div>

                <div className="order-info-row">

                  <span>Guests</span>

                  <strong>
                    {reservation.partySize}
                  </strong>

                </div>

                <div className="order-info-row">

                  <span>Status</span>

                  <span
                    className={`order-status-badge ${getStatusClass(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="col-lg-4">

            <div className="order-details-card mb-4">

              <div className="order-card-header">

                <h5 className="mb-0">

                  Customer

                </h5>

                <i className="bi bi-person order-section-icon"></i>

              </div>

              <div className="order-customer">

                <div className="order-customer-avatar">

                  {reservation.customer.name
                    .charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <div className="order-customer-name">

                    {reservation.customer.name}

                  </div>

                  <div className="order-customer-email">

                    {reservation.customer.email}

                  </div>

                  <div className="order-customer-role">

                    {reservation.customer.role}

                  </div>

                </div>

              </div>

            </div>
                        {/* NOTES */}

            <div className="order-details-card mb-4">

              <div className="order-card-header">

                <h5 className="mb-0">
                  Notes
                </h5>

                <i className="bi bi-chat-left-text order-section-icon"></i>

              </div>

              <div className="p-3">

                {reservation.notes ? (
                  <p className="mb-0">
                    {reservation.notes}
                  </p>
                ) : (
                  <p className="text-muted mb-0">
                    No notes provided.
                  </p>
                )}

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
                value={reservation.status}
                disabled={updatingStatus}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value as ReservationStatus
                  )
                }
              >

                {RESERVATION_STATUSES.map((status) => (
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
                  ? "Updating reservation status..."
                  : "Choose a new reservation status."}

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ReservationDetails;