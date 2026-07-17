import type { Profile, UpdateProfileRequest, AddAddressRequest, Address } from '../types/profile.types';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/api.constants';

export const profileService = {
  /**
   * Get the authenticated user's profile
   */
  getProfile: async (): Promise<Profile> => {
    const response = await axiosInstance.get<any>(API_ENDPOINTS.PROFILE.GET);
    const profile = response.data.data;
    if (profile && Array.isArray(profile.addresses)) {
      profile.addresses = profile.addresses.map((addr: any) => ({
        id: addr._id || addr.id,
        label: addr.label,
        street: addr.street,
        postCode: addr.postCode,
        apartment: addr.apartment,
        isDefault: addr.isDefault,
      }));
    }
    return profile;
  },

  /**
   * Update the authenticated user's profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const response = await axiosInstance.put<any>(API_ENDPOINTS.PROFILE.UPDATE, data);
    const profile = response.data.data;
    if (profile && Array.isArray(profile.addresses)) {
      profile.addresses = profile.addresses.map((addr: any) => ({
        id: addr._id || addr.id,
        label: addr.label,
        street: addr.street,
        postCode: addr.postCode,
        apartment: addr.apartment,
        isDefault: addr.isDefault,
      }));
    }
    return profile;
  },

  /**
   * Add a new address
   */
  addAddress: async (data: AddAddressRequest): Promise<Address> => {
    const response = await axiosInstance.post<any>(API_ENDPOINTS.PROFILE.ADD_ADDRESS, data);
    const addr = response.data.data;
    return {
      id: addr._id || addr.id,
      label: addr.label,
      street: addr.street,
      postCode: addr.postCode,
      apartment: addr.apartment,
      isDefault: addr.isDefault,
    };
  },

  /**
   * Delete an address
   */
  deleteAddress: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.PROFILE.DELETE_ADDRESS(id));
  },
};

