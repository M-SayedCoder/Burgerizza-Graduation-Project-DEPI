import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/api.constants';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  User,
} from '../types/auth.types';

export const authService = {
  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<any>(API_ENDPOINTS.AUTH.LOGIN, data);
    const { token, user } = response.data.data;
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return { token, user };
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<any>(API_ENDPOINTS.AUTH.REGISTER, {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 'customer'
    });
    const { token, user } = response.data.data;
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return { token, user };
  },

  /**
   * Forgot password — send reset email
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * Logout — clear local storage
   */
  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (e) {
      console.warn('Backend logout failed or not supported:', e);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  /**
   * Get current user from localStorage (used on app init)
   */
  getCurrentUser: (): { user: User; token: string } | null => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!token || !userStr) return null;
    try {
      return { user: JSON.parse(userStr) as User, token };
    } catch {
      return null;
    }
  },

  /**
   * Fetch authenticated user profile from server
   */
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<any>(API_ENDPOINTS.AUTH.ME);
    return response.data.data.user;
  },
};
