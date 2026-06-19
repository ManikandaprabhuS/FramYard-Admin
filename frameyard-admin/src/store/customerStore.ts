import { create } from 'zustand';
import { Customer } from '../types';
import { customerService } from '../services/customer.service';

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'joinedDate' | 'ordersCount' | 'totalSpent' | 'status'>) => Promise<boolean>;
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

  addCustomer: async (customer) => {
    set({ loading: true, error: null });
    try {
      const newCustomer = await customerService.createCustomer(customer);
      set((state) => ({
        customers: [newCustomer, ...state.customers],
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to add customer', loading: false });
      return false;
    }
  },
}));
export default useCustomerStore;
