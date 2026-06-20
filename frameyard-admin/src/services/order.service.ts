import api from './api';
import { Order, OrderItem, OrderStatus } from '../types';

const normalizeOrderItem = (item: any): OrderItem => ({
  ...item,
  price: Number(item.price),
  subtotal: Number(item.subtotal),
});

const normalizeOrder = (order: any): Order => ({
  ...order,
  totalAmount: Number(order.totalAmount),
  orderItems: Array.isArray(order.orderItems)
    ? order.orderItems.map(normalizeOrderItem)
    : [],
});

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/admin');
    return (response.data.orders || []).map(normalizeOrder);
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return normalizeOrder(response.data.order);
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await api.patch(`/orders/admin/${id}/status`, {
      orderStatus: status,
    });
    return normalizeOrder(response.data.order);
  },
};
