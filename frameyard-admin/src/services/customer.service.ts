import { Customer, Order } from '../types';
import { orderService } from './order.service';

const toCustomerStatus = (createdAt?: string): Customer['status'] => {
  if (!createdAt) return 'active';
  const joined = new Date(createdAt).getTime();
  const daysSinceJoin = (Date.now() - joined) / (1000 * 60 * 60 * 24);
  return daysSinceJoin <= 30 ? 'new' : 'active';
};

const deriveCustomersFromOrders = (orders: Order[]): Customer[] => {
  const customers = new Map<string, Customer>();

  orders.forEach((order) => {
    const email = order.user?.email || order.userId;
    const existing = customers.get(email);
    const totalAmount = Number(order.totalAmount || 0);

    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += totalAmount;
      return;
    }

    customers.set(email, {
      id: order.userId,
      name: order.user?.name || 'Unknown Customer',
      email,
      phone: order.user?.phoneNumber || order.phoneNumber,
      ordersCount: 1,
      totalSpent: totalAmount,
      joinedDate: order.createdAt,
      status: toCustomerStatus(order.createdAt),
    });
  });

  return Array.from(customers.values()).sort(
    (a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
  );
};

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    const orders = await orderService.getOrders();
    return deriveCustomersFromOrders(orders);
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const customers = await customerService.getCustomers();
    const customer = customers.find((item) => item.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  },
};
export default customerService;
