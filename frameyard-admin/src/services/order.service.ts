import api from './api';
import { Order, OrderStatus } from '../types';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (order: Omit<Order, 'id' | 'date'>): Promise<Order> => {
    const response = await api.post('/orders', order);
    return response.data;
  },

  updateOrder: async (id: string, order: Partial<Order>): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, order);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },
};
