import axiosInstance from './axios';
import { ApiResponse, AuthResponse } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

// POST /api/auth/login
export const login = (payload: LoginPayload) =>
  axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', payload);

// GET /api/auth/me
export const getMe = () =>
  axiosInstance.get<ApiResponse<AuthResponse['user']>>('/auth/me');

// POST /api/auth/logout
export const logout = () =>
  axiosInstance.post('/auth/logout');
