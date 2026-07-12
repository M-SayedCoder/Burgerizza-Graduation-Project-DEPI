import type { Profile, UpdateProfileRequest, AddAddressRequest, Address } from '../types/profile.types';

// ─── Mock Data ────────────────────────────────────────────────────

const MOCK_PROFILE: Profile = {
  id: '1',
  name: 'Mohamed Sayed',
  email: 'mo.sa@gmail.com',
  phone: '01050336677',
  bio: 'I love fast food',
  addresses: [
    { id: 'addr-1', label: 'home', street: '2464 Royal Ln. Mesa, New Jersey', isDefault: true },
    { id: 'addr-2', label: 'work', street: '3891 Ranchview Dr. California' },
  ],
  createdAt: new Date(2024, 0, 1).toISOString(),
};

// ─── Profile Service ──────────────────────────────────────────────

export const profileService = {
  /**
   * Get the authenticated user's profile
   * TODO: Replace with real API call → GET /profile
   */
  getProfile: async (): Promise<Profile> => {
    await new Promise((r) => setTimeout(r, 400));
    // Real: const response = await axiosInstance.get<Profile>(API_ENDPOINTS.PROFILE.GET);
    // return response.data;
    return { ...MOCK_PROFILE };
  },

  /**
   * Update the authenticated user's profile
   * TODO: Replace with real API call → PUT /profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    await new Promise((r) => setTimeout(r, 600));
    // Real: const response = await axiosInstance.put<Profile>(API_ENDPOINTS.PROFILE.UPDATE, data);
    // return response.data;
    return { ...MOCK_PROFILE, ...data };
  },

  /**
   * Add a new address
   * TODO: Replace with real API call → POST /profile/addresses
   */
  addAddress: async (data: AddAddressRequest): Promise<Address> => {
    await new Promise((r) => setTimeout(r, 400));
    const address: Address = { id: 'addr-' + Date.now(), ...data };
    // Real: const response = await axiosInstance.post<Address>(API_ENDPOINTS.PROFILE.ADD_ADDRESS, data);
    // return response.data;
    return address;
  },

  /**
   * Delete an address
   * TODO: Replace with real API call → DELETE /profile/addresses/:id
   */
  deleteAddress: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 300));
    console.log('[Mock] Deleted address:', id);
    // Real: await axiosInstance.delete(API_ENDPOINTS.PROFILE.DELETE_ADDRESS(id));
  },
};
