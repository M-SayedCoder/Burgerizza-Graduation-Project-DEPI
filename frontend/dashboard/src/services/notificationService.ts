import { Notification } from '../types/notification';
import { MOCK, delay } from './config';
import * as notificationApi from '../api/notificationApi';

let _notifications: Notification[] = [
  { _id: 'n1', title: 'New Order', message: 'Sara Ahmed placed a new order of 285 EGP.', type: 'order', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), link: '/orders' },
  { _id: 'n2', title: 'New Reservation', message: 'Laila Nabil booked a table for 6 guests on July 7.', type: 'reservation', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), link: '/reservations' },
  { _id: 'n3', title: 'Order Ready', message: 'Order #o4 is ready for delivery.', type: 'order', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), link: '/orders' },
  { _id: 'n4', title: 'Low Stock Alert', message: 'BBQ Chicken Pizza is out of stock.', type: 'alert', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), link: '/inventory' },
  { _id: 'n5', title: 'System Update', message: 'Dashboard was updated to the latest version.', type: 'system', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
];

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    if (!MOCK.notifications) return notificationApi.getNotifications().then(r => r.data.data ?? []);
    await delay(300);
    return [..._notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markAsRead(id: string): Promise<void> {
    if (!MOCK.notifications) { await notificationApi.markAsRead(id); return; }
    await delay(200);
    _notifications = _notifications.map((n) => n._id === id ? { ...n, isRead: true } : n);
  },

  async markAllAsRead(): Promise<void> {
    if (!MOCK.notifications) { await notificationApi.markAllAsRead(); return; }
    await delay(300);
    _notifications = _notifications.map((n) => ({ ...n, isRead: true }));
  },

  async deleteNotification(id: string): Promise<void> {
    if (!MOCK.notifications) { await notificationApi.deleteNotification(id); return; }
    await delay(200);
    _notifications = _notifications.filter((n) => n._id !== id);
  },

  async clearAll(): Promise<void> {
    if (!MOCK.notifications) { await notificationApi.clearAll(); return; }
    await delay(300);
    _notifications = [];
  },

  getUnreadCount(): number {
    return _notifications.filter((n) => !n.isRead).length;
  },
};
