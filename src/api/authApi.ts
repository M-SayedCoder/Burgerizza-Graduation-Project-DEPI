import { apiRequest } from "./apiClient";

import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
} from "../types/auth";

export function login(data: LoginPayload) {
  return apiRequest<LoginResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function getMe() {
  return apiRequest<MeResponse>(
    "/api/auth/me"
  );
}