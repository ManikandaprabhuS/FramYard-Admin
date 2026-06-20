export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: string;
  addressLine?: string | null;
  postalCode?: string | null;
  cityName?: string | null;
  stateName?: string | null;
  countryName?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  role: 'CUSTOMER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
}

export type ProductStatus = 'active' | 'draft';

export interface ProductVariant {
  id: string;
  productId: string;
  frameSize: string;
  hasBorder: boolean;
  hasGlass: boolean;
  price: number;
  offerPrice?: number | null;
  stockQuantity: number;
  priceValidUntil?: string | null;
  createdAt: string;
}
export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  displayOrder: number;
}
export interface Product {
  id: string;
  name: string;
  description?: string;
  brandName: string;
  material: string;
  availableColors: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  variants: ProductVariant[];
  images?: ProductImage[];
}
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  frameSize: string;
  hasBorder: boolean;
  hasGlass: boolean;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  phoneNumber: string;
  addressLine: string;
  cityName: string;
  stateName: string;
  countryName: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, 'name' | 'email' | 'phoneNumber'>;
  orderItems: OrderItem[];
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
