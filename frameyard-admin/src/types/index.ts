export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

export type ProductStatus = 'active' | 'draft';

export interface ProductVariant {
  id: string;
  size: string;
  border: string;
  price: number;
  offerPrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  material: string;
  colors: string[]; // e.g. ["#slate-900", "#amber-100"] or color names/values
  variants: ProductVariant[];
  status: ProductStatus;
  createdDate: string;
  images: string[]; // URLs of product images
}

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemsCount: number;
  amount: number;
  status: OrderStatus;
  date: string;
  items: OrderItem[];
}

export type CustomerStatus = 'active' | 'new' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  status: CustomerStatus;
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  date: string;
}
