import { User } from '../types';
import { MOCK, delay } from './config';
import { mockUsers } from './mockData';
import axiosInstance from '../api/axios';

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileService = {
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    // TODO (Backend): PUT /api/auth/profile  { name, email, phone }
    if (!MOCK.auth) {
      const res = await axiosInstance.put<{ success: boolean; data: User }>('/auth/profile', payload);
      return res.data.data;
    }
    await delay(700);
    const stored = localStorage.getItem('manager_user');
    const current: User = stored ? JSON.parse(stored) : mockUsers[0];
    const updated: User = { ...current, ...payload };
    localStorage.setItem('manager_user', JSON.stringify(updated));
    // Also patch mock array
    const idx = mockUsers.findIndex((u) => u._id === current._id);
    if (idx !== -1) mockUsers[idx] = updated;
    return updated;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    // TODO (Backend): PUT /api/auth/password  { currentPassword, newPassword }
    if (!MOCK.auth) {
      await axiosInstance.put('/auth/password', {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      });
      return;
    }
    await delay(700);
    // Mock: always succeeds if currentPassword === 'any' or length > 0
    if (!payload.currentPassword) throw new Error('Current password is required');
    if (payload.newPassword !== payload.confirmPassword) throw new Error('Passwords do not match');
    if (payload.newPassword.length < 6) throw new Error('Password must be at least 6 characters');
  },
};
