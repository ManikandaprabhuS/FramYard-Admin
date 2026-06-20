import { create } from 'zustand';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/order.service';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  changeOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.getOrders();
      set({ orders: data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch orders', loading: false });
    }
  },

  changeOrderStatus: async (id, status) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
      }));
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to update order status' });
      return false;
    }
  },
}));
