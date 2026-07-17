export type Role = 'customer' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}
