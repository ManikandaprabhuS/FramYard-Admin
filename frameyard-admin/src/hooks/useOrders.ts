import { useEffect } from 'react';
import { useOrderStore } from '../store/orderStore';

export const useOrders = (autoFetch = false) => {
  const orders = useOrderStore((state) => state.orders);
  const loading = useOrderStore((state) => state.loading);
  const error = useOrderStore((state) => state.error);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const addOrder = useOrderStore((state) => state.addOrder);
  const changeOrderStatus = useOrderStore((state) => state.changeOrderStatus);

  useEffect(() => {
    if (autoFetch && orders.length === 0) {
      fetchOrders();
    }
  }, [autoFetch, fetchOrders, orders.length]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    changeOrderStatus,
  };
};
export default useOrders;
