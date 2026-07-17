import axiosInstance from './axios';
import { ApiResponse, AuthResponse } from '../types';
import { apiRequest } from "./apiClient";
import type {
  LoginPayload as AdminLoginPayload,
  LoginResponse as AdminLoginResponse,
  MeResponse as AdminMeResponse,
} from "../types/auth";

interface LoginPayload {
  email: string;
  password: string;
}

// ==================== Manager/Staff Endpoints (Axios) ====================

// POST /api/auth/login
export const login = (payload: LoginPayload) =>
  axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', payload);

// GET /api/auth/me
export const getMe = () =>
  axiosInstance.get<ApiResponse<AuthResponse['user']>>('/auth/me');

// POST /api/auth/logout
export const logout = () =>
  axiosInstance.post('/auth/logout');

// ==================== Admin Endpoints (Fetch) ====================

export function adminLogin(data: AdminLoginPayload) {
  return apiRequest<AdminLoginResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export function getAdminMe() {
  return apiRequest<AdminMeResponse>(
    "/api/auth/me"
  );
}
