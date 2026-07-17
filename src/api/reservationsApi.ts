import { apiRequest } from "./apiClient";

import type {
  Reservation,
  GetReservationsParams,
  GetReservationsResponse,
  CreateReservationPayload,
  UpdateReservationPayload,
  UpdateReservationStatusPayload,
  ReservationStatus,
} from "../types/reservation";

export function getReservations(
  params: GetReservationsParams = {}
) {
  const query = new URLSearchParams();

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.sort) {
    query.set("sort", params.sort);
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  const queryString = query.toString();

  return apiRequest<GetReservationsResponse>(
    `/api/reservations${
      queryString ? `?${queryString}` : ""
    }`
  );
}

export function getReservationById(id: string) {
  return apiRequest<Reservation>(
    `/api/reservations/${id}`
  );
}

export function createReservation(
  data: CreateReservationPayload
) {
  return apiRequest<Reservation>(
    "/api/reservations",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateReservation(
  id: string,
  data: UpdateReservationPayload
) {
  return apiRequest<Reservation>(
    `/api/reservations/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export function updateReservationStatus(
  id: string,
  status: ReservationStatus
) {
  const payload: UpdateReservationStatusPayload = {
    status,
  };

  return apiRequest<Reservation>(
    `/api/reservations/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export function deleteReservation(id: string) {
  return apiRequest<Record<string, never>>(
    `/api/reservations/${id}`,
    {
      method: "DELETE",
    }
  );
}