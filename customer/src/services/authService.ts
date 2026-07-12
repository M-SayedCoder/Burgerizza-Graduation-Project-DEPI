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

// ─── Mock Data ────────────────────────────────────────────────────
// TODO: Remove mock data when real backend is connected.

const MOCK_USER: User = {
  id: '1',
  name: 'Mohamed Sayed',
  email: 'mo.sa@gmail.com',
  phone: '01050336677',
  bio: 'I love fast food',
};

// ─── Auth Service ─────────────────────────────────────────────────

export const authService = {
  /**
   * Login user
   * TODO: Replace with real API call → POST /auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // MOCK: Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    if (data.email === 'demo@burgerizza.com' && data.password === 'password') {
      const response: LoginResponse = {
        user: MOCK_USER,
        token: 'mock-jwt-token-' + Date.now(),
      };
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      return response;
    }

    // Real implementation:
    // const response = await axiosInstance.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    // localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    // localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    // return response.data;

    throw new Error('Invalid email or password. Try demo@burgerizza.com / password');
  },

  /**
   * Register a new user
   * TODO: Replace with real API call → POST /auth/register
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    await new Promise((r) => setTimeout(r, 800));

    const response: RegisterResponse = {
      user: { ...MOCK_USER, name: data.name, email: data.email, id: Date.now().toString() },
      token: 'mock-jwt-token-' + Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    return response;

    // Real implementation:
    // const response = await axiosInstance.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    // localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    // localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    // return response.data;
  },

  /**
   * Forgot password — send reset email
   * TODO: Replace with real API call → POST /auth/forgot-password
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await new Promise((r) => setTimeout(r, 600));
    console.log('[Mock] Reset email sent to:', data.email);
    // Real: await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * Logout — clear local storage
   */
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    // TODO: POST /auth/logout to invalidate server-side session
    // await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
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
   * TODO: Replace with real API call → GET /auth/me
   */
  getMe: async (): Promise<User> => {
    // Real: const response = await axiosInstance.get<User>(API_ENDPOINTS.AUTH.ME);
    // return response.data;
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_USER;
  },
};

// Suppress unused import warning until real API is wired
void axiosInstance;
void API_ENDPOINTS;
