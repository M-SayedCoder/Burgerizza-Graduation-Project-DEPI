import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { loginThunk, registerThunk, logoutThunk, clearError } from '../store/authSlice';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

// ─── useAuth Hook ─────────────────────────────────────────────────
// Provides auth state and actions from Redux store

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginRequest) => {
    return dispatch(loginThunk(credentials));
  };

  const register = async (data: RegisterRequest) => {
    return dispatch(registerThunk(data));
  };

  const logout = async () => {
    return dispatch(logoutThunk());
  };

  const dismissError = () => {
    dispatch(clearError());
  };

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login,
    register,
    logout,
    dismissError,
  };
};
