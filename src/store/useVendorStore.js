import { create } from 'zustand';
import { apiClient } from '../lib/apiClient';

export const useVendorStore = create((set) => ({
  status: 'idle', // idle, loading, success, error
  error: null,

  apply: async (formData) => {
    set({ status: 'loading', error: null });
    try {
      await apiClient.post('/api/vendors/apply', formData);
      set({ status: 'success' });
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      set({ status: 'error', error: message });
      throw new Error(message);
    }
  },

  reset: () => set({ status: 'idle', error: null }),
}));
