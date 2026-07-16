export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'order' | 'reservation' | 'system' | 'alert';
  isRead: boolean;
  createdAt: string;
  link?: string;
}
