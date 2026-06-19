import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Product, Order, Customer, User, Notification } from '../types';

// Setup default Axios client
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('fy_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Seed Initial Data Helper
const seedDatabase = () => {
  // Seed Users
  if (!localStorage.getItem('fy_users')) {
    const defaultUser: User = {
      id: 'usr-1',
      name: 'Alex Mercer',
      email: 'admin@frameyard.com',
      role: 'Store Manager',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSYOBDueaLaJcDNnVI6t7Lco5UCHF2lGwL2m-EhPiP5Gn5UIkDcawBEbzjYjZGR5VlASyRhDzy_ChuETubOpUa1bYfqi1igDdRDZAYh7HatH2RbBMQeMm8rrL73QUTFt2tmaryI3oGo2eaEQ4jTTSMTu6akNW3vITxAWn-thIUw5IaHqAgdADcWFtOsgmI_YgLwk0sHtIvuR7DuMJlZxpNvHwT6_zCNOlH4Y4EGLp1PTjMBN24qXYpC50xGF9icYqfbPXbNT42J14',
    };
    localStorage.setItem('fy_users', JSON.stringify([defaultUser]));
  }

  // Seed Products
  if (!localStorage.getItem('fy_products')) {
    const defaultProducts: Product[] = [
      {
        id: '1',
        name: 'Nordic Oak Gallery',
        description: 'Crafted from premium sustainably sourced solid oak, this frame features a slim 15mm profile designed for modern interiors. Perfect for fine art prints and gallery-style displays.',
        brand: 'FrameYard Studio',
        material: 'Solid Oak',
        colors: ['#0f172a', '#fef3c7', '#ffffff'], // Slate-900, Amber-100, White
        status: 'active',
        createdDate: '2023-10-12',
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDtOMrVmmlMOFx1j7dQmiTVIzXkzRmhZ1HbvPmaAejXN9KpZc-vhjwzX0R73FuXVlrIiofToAD-H1IphGy5teCfNr-P6yn_qeqAX7pOqZQjdESwYjMjmBrdYEUb15VoMGWt0tcrKY2ccBuFElCpnvInaD_dt2H2tw6wrpHwS80SP32ENGanaszNFbKVeQb7PiUfPzzwiC3ag98bP6xaB-kyBEys46CkDg1_jGqRkgx84D3jnzdd7J4pFnRwlNY59s5jFi9X9fn_wCoo',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCbyHggwgwjPPbPLSomWefdLIHQow-Uh8G13UzrP00fEjq0OJFpOA1IOFpMIqc4rBHlfrIzBy8TdCRpKQXRwyXSdRu37e6o93d0ZMqsCttcnVcc9kmxCKb8OgAOVhBEhWEpLqbvt9PfQyy-rVlDuntBh2Yi2XivWOCNjWdc48jg30-fIxQMrnYROUfVmX0hlWxiphFJq6jkASVasGlv4hAIL1xw9hX1FfFil7Lme703zFKei1AgsCiVLX3JLGz6xBEwMlpzm1Ip41VA',
        ],
        variants: [
          { id: 'v1', size: '8" x 10"', border: 'White Matte', price: 45, offerPrice: 39, stock: 124 },
          { id: 'v2', size: '11" x 14"', border: 'Natural Oak', price: 65, stock: 82 },
          { id: 'v3', size: '24" x 36"', border: 'Deep Bevel', price: 120, stock: 14 },
        ],
      },
      {
        id: '2',
        name: 'Sleek Metal Slim',
        description: 'Luxurious anodized aluminum frame with an ultra-thin border. Gives a floating impression. Best suited for high-resolution graphics and corporate prints.',
        brand: 'AluFrame Corp',
        material: 'Anodized Aluminum',
        colors: ['#94a3b8', '#ca8a04'], // Silver, Gold
        status: 'active',
        createdDate: '2023-11-03',
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDY3OFmCnMan8ZyV2Vxb95HjrqDzRvf7ylYc_NHfOwUkEdNJBCklKj2HeZKvnP7Z3DIyUnRKWbQPYM2NNLUNAH6Rp0ay-HQk_-U7nVbYDoZO9TUg6cIdw7hjhKqxr0bxcN-2nmYU0ZzY3rhdBltTVCWjQMhgbU8qksW1rKgYeR7b6jLAtyeUBYhcJMnvPfhtODFcRjNpPdOP29Hb9aeP7AHQCvZDfMr0zFwVdso9adOyJhE1uzSF38THfAUTXHWnBnzZKIlnn1O1RMM',
        ],
        variants: [
          { id: 'v4', size: 'A3 Size', border: 'None', price: 55, stock: 8 },
          { id: 'v5', size: '18" x 24"', border: 'Black Matte', price: 79, stock: 12 },
        ],
      },
      {
        id: '3',
        name: 'Heritage Walnut',
        description: 'Intricately crafted vintage walnut wood frame with classic curves. Deep espresso finish that emphasizes traditional hand-carved joinery details.',
        brand: 'Classic Joinery',
        material: 'Walnut Wood',
        colors: ['#431407'], // Dark Walnut
        status: 'draft',
        createdDate: '2024-01-15',
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDCOmxZEVJDy0DlJ-NXqs5Tzx8cLGmxYp86Tu0VsENhiHfvi0vB_rKcmvnxhNeaZYdkaL2yeSLusytwDrBkdrXlmd9czxhvVfPWOAX2EonlCH-AYQ1XPOqImGq-bfa87cnmdSSvxu1McWOlT66hg88TQNGElX5VdRg9FLJISWOVQsAMvLgzNuSuuLmKSxqcqVF7dJs0YGYERpnPm9CBhM15aMPy5xDDdKiCQ0Tm4s56NNhFchp4T2CzXknomK0H3jO7uRPOhcFIhMS7',
        ],
        variants: [
          { id: 'v6', size: '16" x 20"', border: 'Gold Fillet', price: 95, stock: 0 },
        ],
      },
    ];
    localStorage.setItem('fy_products', JSON.stringify(defaultProducts));
  }

  // Seed Orders
  if (!localStorage.getItem('fy_orders')) {
    const defaultOrders: Order[] = [
      {
        id: 'FY-8921',
        customerName: 'Eleanor Pena',
        customerEmail: 'eleanor@example.com',
        customerPhone: '(555) 123-4567',
        itemsCount: 3,
        amount: 450.00,
        status: 'pending',
        date: '2023-10-24',
        items: [
          { id: 'oi-1', productName: 'Nordic Oak Gallery', variantName: '11" x 14" (Natural Oak)', quantity: 2, price: 65 },
          { id: 'oi-2', productName: 'Sleek Metal Slim', variantName: '18" x 24" (Silver)', quantity: 1, price: 320 },
        ],
      },
      {
        id: 'FY-8920',
        customerName: 'Wade Warren',
        customerEmail: 'wade@example.com',
        customerPhone: '(555) 987-6543',
        itemsCount: 1,
        amount: 120.50,
        status: 'processing',
        date: '2023-10-23',
        items: [
          { id: 'oi-3', productName: 'Nordic Oak Gallery', variantName: '24" x 36" (Deep Bevel)', quantity: 1, price: 120.50 },
        ],
      },
      {
        id: 'FY-8919',
        customerName: 'Brooklyn Simmons',
        customerEmail: 'brooklyn@example.com',
        customerPhone: '(555) 246-8101',
        itemsCount: 5,
        amount: 1250.00,
        status: 'delivered',
        date: '2023-10-22',
        items: [
          { id: 'oi-4', productName: 'Nordic Oak Gallery', variantName: '24" x 36" (Deep Bevel)', quantity: 5, price: 250 },
        ],
      },
      {
        id: 'FY-8918',
        customerName: 'Guy Hawkins',
        customerEmail: 'guy@example.com',
        customerPhone: '(555) 369-2580',
        itemsCount: 2,
        amount: 340.00,
        status: 'cancelled',
        date: '2023-10-21',
        items: [
          { id: 'oi-5', productName: 'Heritage Walnut', variantName: '16" x 20"', quantity: 2, price: 170 },
        ],
      },
    ];
    localStorage.setItem('fy_orders', JSON.stringify(defaultOrders));
  }

  // Seed Customers
  if (!localStorage.getItem('fy_customers')) {
    const defaultCustomers: Customer[] = [
      { id: 'c-1', name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+1 (555) 123-4567', ordersCount: 12, totalSpent: 1450.00, joinedDate: '2023-10-12', status: 'active' },
      { id: 'c-2', name: 'John Smith', email: 'j.smith@corporate.net', phone: '+1 (555) 987-6543', ordersCount: 3, totalSpent: 320.50, joinedDate: '2023-11-05', status: 'active' },
      { id: 'c-3', name: 'Elena Wong', email: 'elena.w@studio.io', phone: 'Not Provided', ordersCount: 0, totalSpent: 0.00, joinedDate: '2023-12-01', status: 'new' },
      { id: 'c-4', name: 'Marcus Reed', email: 'm.reed88@gmail.com', phone: '+44 7700 900077', ordersCount: 1, totalSpent: 85.00, joinedDate: '2023-08-22', status: 'inactive' },
    ];
    localStorage.setItem('fy_customers', JSON.stringify(defaultCustomers));
  }

  // Seed Notifications
  if (!localStorage.getItem('fy_notifications')) {
    const defaultNotifications: Notification[] = [
      { id: 'n-1', title: 'Low Stock Alert', message: 'Classic Oak Frame (18x24) has only 2 units left.', type: 'warning', read: false, date: '2026-06-19T10:30:00Z' },
      { id: 'n-2', title: 'Out of Stock Alert', message: 'Acrylic Box Frame (Square 12x12) is completely out of stock.', type: 'error', read: false, date: '2026-06-19T09:15:00Z' },
      { id: 'n-3', title: 'New Order Received', message: 'Order #FY-8921 has been placed by Eleanor Pena.', type: 'success', read: true, date: '2026-06-18T16:45:00Z' },
      { id: 'n-4', title: 'System Maintenance Completed', message: 'Database optimization script has run successfully.', type: 'info', read: true, date: '2026-06-17T02:00:00Z' },
    ];
    localStorage.setItem('fy_notifications', JSON.stringify(defaultNotifications));
  }
};

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
