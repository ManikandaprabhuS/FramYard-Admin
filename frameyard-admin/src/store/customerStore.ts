import { create } from 'zustand';
import { Customer } from '../types';
import { customerService } from '../services/customer.service';

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  loading: false,
  error: null,

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await customerService.getCustomers();
      set({ customers: data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch customers', loading: false });
    }
  },

}));
export default useCustomerStore;
