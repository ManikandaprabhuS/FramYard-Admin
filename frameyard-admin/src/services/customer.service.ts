import api from './api';
import { Customer } from '../types';

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customer: Omit<Customer, 'id' | 'joinedDate' | 'ordersCount' | 'totalSpent' | 'status'>): Promise<Customer> => {
    const response = await api.post('/customers', customer);
    return response.data;
  },
};
export default customerService;
