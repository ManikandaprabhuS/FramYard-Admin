// @ts-nocheck
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Product, Order, Customer, User, Notification } from '../types';

const seedDatabase = () => {};

// Setup default Axios client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth token interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "fy_auth_token"
      );
    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }
    return config;
  }
);

// Execute Seeding
seedDatabase();

// Define Custom Axios Mock Adapter
api.defaults.adapter = async (config) => {
  // Simulated Latency
  await new Promise((resolve) => setTimeout(resolve, 400));

  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  const getLocalStorageData = <T>(key: string): T[] => {
    return JSON.parse(localStorage.getItem(key) || '[]');
  };

  const setLocalStorageData = <T>(key: string, data: T[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  try {
    // -------------------------------------------------------------
    // Auth Routes
    // -------------------------------------------------------------
    if (url.match(/^\/auth\/login/)) {
      const { email, password } = JSON.parse(config.data || '{}');
      if (email === 'admin@frameyard.com' && password === 'password') {
        const users = getLocalStorageData<User>('fy_users');
        const user = users[0];
        localStorage.setItem('fy_auth_token', 'mock_jwt_token_alex_mercer');
        return {
          data: { user, token: 'mock_jwt_token_alex_mercer' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }
      return Promise.reject({
        response: {
          data: { message: 'Invalid credentials. Use admin@frameyard.com / password.' },
          status: 401,
          statusText: 'Unauthorized',
        },
      });
    }

    if (url.match(/^\/auth\/me/)) {
      const token = localStorage.getItem('fy_auth_token');
      if (!token) {
        return Promise.reject({
          response: { data: { message: 'Unauthorized' }, status: 401 },
        });
      }
      const users = getLocalStorageData<User>('fy_users');
      return {
        data: users[0],
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse;
    }

    if (url.match(/^\/auth\/profile/)) {
      if (method === 'put') {
        const updatedProfile = JSON.parse(config.data || '{}');
        const users = getLocalStorageData<User>('fy_users');
        const user = { ...users[0], ...updatedProfile };
        setLocalStorageData('fy_users', [user]);
        return {
          data: user,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }
    }

    // -------------------------------------------------------------
    // Products Routes
    // -------------------------------------------------------------
    if (url.match(/^\/products/)) {
      const products = getLocalStorageData<Product>('fy_products');

      // GET Single Product
      const matchDetail = url.match(/^\/products\/([a-zA-Z0-9-]+)$/);
      if (matchDetail) {
        const productId = matchDetail[1];
        const product = products.find((p) => p.id === productId);
        if (!product) {
          return Promise.reject({ response: { data: { message: 'Product not found' }, status: 404 } });
        }
        return {
          data: product,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // GET All Products
      if (method === 'get') {
        return {
          data: products,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // POST Create Product
      if (method === 'post') {
        const newProduct: Product = JSON.parse(config.data || '{}');
        newProduct.id = Math.random().toString(36).substr(2, 9);
        newProduct.createdDate = new Date().toISOString().split('T')[0];
        if (!newProduct.images || newProduct.images.length === 0) {
          newProduct.images = ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=400'];
        }
        products.push(newProduct);
        setLocalStorageData('fy_products', products);
        return {
          data: newProduct,
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // PUT Update Product
      const matchUpdate = url.match(/^\/products\/([a-zA-Z0-9-]+)$/);
      if (method === 'put' && matchUpdate) {
        const productId = matchUpdate[1];
        const updatedBody = JSON.parse(config.data || '{}');
        const index = products.findIndex((p) => p.id === productId);
        if (index === -1) {
          return Promise.reject({ response: { data: { message: 'Product not found' }, status: 404 } });
        }
        products[index] = { ...products[index], ...updatedBody };
        setLocalStorageData('fy_products', products);
        return {
          data: products[index],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // DELETE Product
      const matchDelete = url.match(/^\/products\/([a-zA-Z0-9-]+)$/);
      if (method === 'delete' && matchDelete) {
        const productId = matchDelete[1];
        const index = products.findIndex((p) => p.id === productId);
        if (index === -1) {
          return Promise.reject({ response: { data: { message: 'Product not found' }, status: 404 } });
        }
        products.splice(index, 1);
        setLocalStorageData('fy_products', products);
        return {
          data: { success: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }
    }

    // -------------------------------------------------------------
    // Orders Routes
    // -------------------------------------------------------------
    if (url.match(/^\/orders/)) {
      const orders = getLocalStorageData<Order>('fy_orders');

      // GET Single Order
      const matchDetail = url.match(/^\/orders\/([a-zA-Z0-9-]+)$/);
      if (matchDetail) {
        const orderId = matchDetail[1];
        const order = orders.find((o) => o.id === orderId);
        if (!order) {
          return Promise.reject({ response: { data: { message: 'Order not found' }, status: 404 } });
        }
        return {
          data: order,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // GET All Orders
      if (method === 'get') {
        return {
          data: orders,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // POST Create Order
      if (method === 'post') {
        const newOrder: Order = JSON.parse(config.data || '{}');
        newOrder.id = 'FY-' + Math.floor(1000 + Math.random() * 9000);
        newOrder.date = new Date().toISOString().split('T')[0];
        orders.unshift(newOrder);
        setLocalStorageData('fy_orders', orders);
        return {
          data: newOrder,
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // PUT Update Order Status (or generic update)
      const matchUpdate = url.match(/^\/orders\/([a-zA-Z0-9-]+)$/);
      if (method === 'put' && matchUpdate) {
        const orderId = matchUpdate[1];
        const updatedBody = JSON.parse(config.data || '{}');
        const index = orders.findIndex((o) => o.id === orderId);
        if (index === -1) {
          return Promise.reject({ response: { data: { message: 'Order not found' }, status: 404 } });
        }
        orders[index] = { ...orders[index], ...updatedBody };
        setLocalStorageData('fy_orders', orders);
        return {
          data: orders[index],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }
    }

    // -------------------------------------------------------------
    // Customers Routes
    // -------------------------------------------------------------
    if (url.match(/^\/customers/)) {
      const customers = getLocalStorageData<Customer>('fy_customers');

      // GET Single Customer
      const matchDetail = url.match(/^\/customers\/([a-zA-Z0-9-]+)$/);
      if (matchDetail) {
        const customerId = matchDetail[1];
        const customer = customers.find((c) => c.id === customerId);
        if (!customer) {
          return Promise.reject({ response: { data: { message: 'Customer not found' }, status: 404 } });
        }
        return {
          data: customer,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // GET All Customers
      if (method === 'get') {
        return {
          data: customers,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // POST Create Customer
      if (method === 'post') {
        const newCustomer: Customer = JSON.parse(config.data || '{}');
        newCustomer.id = 'c-' + Math.random().toString(36).substr(2, 5);
        newCustomer.joinedDate = new Date().toISOString().split('T')[0];
        newCustomer.ordersCount = 0;
        newCustomer.totalSpent = 0;
        newCustomer.status = 'new';
        customers.unshift(newCustomer);
        setLocalStorageData('fy_customers', customers);
        return {
          data: newCustomer,
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        } as AxiosResponse;
      }
    }

    // -------------------------------------------------------------
    // Notifications Routes
    // -------------------------------------------------------------
    if (url.match(/^\/notifications/)) {
      const notifications = getLocalStorageData<Notification>('fy_notifications');

      // GET All Notifications
      if (method === 'get') {
        return {
          data: notifications,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }

      // PUT Mark All Read
      if (method === 'put' && url.match(/\/mark-all-read/)) {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        setLocalStorageData('fy_notifications', updated);
        return {
          data: updated,
          status: 200,
          headers: {},
          config,
        } as AxiosResponse;
      }

      // PUT Toggle individual notification read state
      const matchUpdate = url.match(/^\/notifications\/([a-zA-Z0-9-]+)$/);
      if (method === 'put' && matchUpdate) {
        const notifId = matchUpdate[1];
        const index = notifications.findIndex((n) => n.id === notifId);
        if (index !== -1) {
          notifications[index].read = !notifications[index].read;
          setLocalStorageData('fy_notifications', notifications);
          return {
            data: notifications[index],
            status: 200,
            headers: {},
            config,
          } as AxiosResponse;
        }
      }

      // DELETE single notification
      const matchDelete = url.match(/^\/notifications\/([a-zA-Z0-9-]+)$/);
      if (method === 'delete' && matchDelete) {
        const notifId = matchDelete[1];
        const filtered = notifications.filter((n) => n.id !== notifId);
        setLocalStorageData('fy_notifications', filtered);
        return {
          data: { success: true },
          status: 200,
          headers: {},
          config,
        } as AxiosResponse;
      }
    }

    // Return a default 404 for unmatched mock paths
    return Promise.reject({
      response: { data: { message: 'Mock API Route Not Found' }, status: 404 },
    });
  } catch (err: any) {
    return Promise.reject({
      response: { data: { message: err.message || 'JSON Parse error in Mock DB' }, status: 500 },
    });
  }
};

export default api;
