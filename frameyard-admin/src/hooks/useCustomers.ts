import { useEffect } from 'react';
import { useCustomerStore } from '../store/customerStore';

export const useCustomers = (autoFetch = false) => {
  const customers = useCustomerStore((state) => state.customers);
  const loading = useCustomerStore((state) => state.loading);
  const error = useCustomerStore((state) => state.error);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  useEffect(() => {
    if (autoFetch && customers.length === 0) {
      fetchCustomers();
    }
  }, [autoFetch, fetchCustomers, customers.length]);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
  };
};
export default useCustomers;
