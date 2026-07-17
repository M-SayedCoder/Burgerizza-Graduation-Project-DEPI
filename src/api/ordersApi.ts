import { apiRequest } from "./apiClient";

import type {
  Order,
  GetOrdersParams,
  GetOrdersResponse,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  OrderStatus,
} from "../types/order";

export function getOrders(params: GetOrdersParams = {}) {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

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

  return apiRequest<GetOrdersResponse>(
    `/api/orders${queryString ? `?${queryString}` : ""}`
  );
}

export function getOrderById(id: string) {
  return apiRequest<Order>(
    `/api/orders/${id}`
  );
}

export function createOrder(data: CreateOrderPayload) {
  return apiRequest<Order>(
    "/api/orders",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus
) {
  const payload: UpdateOrderStatusPayload = {
    status,
  };

  return apiRequest<Order>(
    `/api/orders/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export function deleteOrder(id: string) {
  return apiRequest<Record<string, never>>(
    `/api/orders/${id}`,
    {
      method: "DELETE",
    }
  );
}