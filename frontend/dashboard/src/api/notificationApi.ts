import axiosInstance from './axios';
import { Notification } from '../types/notification';
import { ApiResponse } from '../types';

export const getNotifications = () =>
  axiosInstance.get<ApiResponse<Notification[]>>('/notifications');

export const markAsRead = (id: string) =>
  axiosInstance.put<ApiResponse<null>>(`/notifications/${id}/read`);

export const markAllAsRead = () =>
  axiosInstance.put<ApiResponse<null>>('/notifications/read-all');

export const deleteNotification = (id: string) =>
  axiosInstance.delete<ApiResponse<null>>(`/notifications/${id}`);

export const clearAll = () =>
  axiosInstance.delete<ApiResponse<null>>('/notifications');
