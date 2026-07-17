// ─── Profile Types ──────────────────────────────────────────────

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: 'home' | 'work' | 'other';
  street: string;
  postCode?: string;
  apartment?: string;
  isDefault?: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export interface AddAddressRequest {
  label: 'home' | 'work' | 'other';
  street: string;
  postCode?: string;
  apartment?: string;
}
