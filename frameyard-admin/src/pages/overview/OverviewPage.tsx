import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import useOrders from '../../hooks/useOrders';
import useCustomers from '../../hooks/useCustomers';
import KpiCard from '../../components/ui/KpiCard';
import Badge from '../../components/ui/Badge';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

// Mock chart data for 30 days
const chartData = [
  { day: '01 Jun', revenue: 3000 },
  { day: '05 Jun', revenue: 4200 },
  { day: '10 Jun', revenue: 3800 },
  { day: '15 Jun', revenue: 5100 },
  { day: '20 Jun', revenue: 4900 },
  { day: '25 Jun', revenue: 6200 },
  { day: '30 Jun', revenue: 7500 },
];

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, loading: loadingProducts } = useProducts(true);
  const { orders, fetchOrders, loading: loadingOrders } = useOrders(true);
  const { customers, fetchCustomers, loading: loadingCustomers } = useCustomers(true);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, [fetchProducts, fetchOrders, fetchCustomers]);

  // Dynamic calculations based on seeded base + local updates
  const baseRevenue = 122339.50;
  const calculatedRevenue = baseRevenue + orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.amount : sum, 0);
  
  const baseOrders = 1280;
  const calculatedOrders = baseOrders + orders.length;

  const baseCustomers = 8428;
  const calculatedCustomers = baseCustomers + customers.length;

  const baseProducts = 339;
  const calculatedProducts = baseProducts + products.length;

  // Recent 4 orders
  const recentOrders = orders.slice(0, 4);

  // Filter low stock products from products store
  const lowStockAlerts = products
    .flatMap(p => p.variants.map(v => ({
      name: p.name,
      variantName: v.size,
      stock: v.stock,
      productId: p.id,
      status: v.stock === 0 ? 'Out of Stock' : v.stock <= 5 ? 'Critical' : 'Low'
    })))
    .filter(item => item.stock <= 15)
    .slice(0, 4);

  // Fallbacks if database variants don't match, seed default low stocks
  const displayLowStock = lowStockAlerts.length > 0 ? lowStockAlerts : [
    { name: 'Classic Oak Frame', variantName: '18x24', stock: 2, status: 'Critical', productId: '1' },
    { name: 'Matte Black Gallery', variantName: 'A3', stock: 8, status: 'Low', productId: '2' },
    { name: 'Walnut Float Frame', variantName: 'Custom', stock: 12, status: 'Low', productId: '3' },
    { name: 'Acrylic Box Frame', variantName: 'Square 12x12', stock: 0, status: 'Out of Stock', productId: '1' }
  ];

  // Order Fulfillment quantities
  const pendingCount = orders.filter(o => o.status === 'pending').length + 42;
  const processingCount = orders.filter(o => o.status === 'processing').length + 18;
  const shippedCount = orders.filter(o => o.status === 'delivered').length + 156; // Mock shipping representation
  const deliveredCount = 890;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length + 12;

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge type="success">Delivered</Badge>;
      case 'processing':
        return <Badge type="info">Processing</Badge>;
      case 'pending':
        return <Badge type="warning">Pending</Badge>;
      case 'cancelled':
        return <Badge type="error">Cancelled</Badge>;
      default:
        return <Badge type="neutral">{status}</Badge>;
    }
  };

  const getStockStatusBadge = (status: string) => {
    if (status === 'Out of Stock') return <Badge type="error">Out of Stock</Badge>;
    if (status === 'Critical') return <Badge type="error">Critical</Badge>;
    return <Badge type="warning">Low</Badge>;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-1">Overview</h2>
        <p className="text-sm text-on-surface-variant">Your store's performance at a glance.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Revenue"
          value={`$${calculatedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend="+14.5%"
          trendType="up"
          trendText="from last month"
        />
        <KpiCard
          title="Total Orders"
          value={calculatedOrders.toLocaleString('en-US')}
          icon={ShoppingBag}
          trend="+5.2%"
          trendType="up"
          trendText="from last month"
          onClick={() => navigate('/admin/orders')}
        />
        <KpiCard
          title="Total Customers"
          value={calculatedCustomers.toLocaleString('en-US')}
          icon={Users}
          trend="+1.1%"
          trendType="neutral"
          trendText="from last month"
          onClick={() => navigate('/admin/customers')}
        />
        <KpiCard
          title="Active Products"
          value={calculatedProducts}
          icon={Package}
          trend="-2"
          trendType="down"
          trendText="items out of stock"
          onClick={() => navigate('/admin/products')}
        />
      </div>

      {/* Recharts Chart & Fulfillment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Revenue (Last 30 Days)</h3>
            <button className="text-xs text-primary font-semibold hover:bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant transition-colors">
              View Report
            </button>
          </div>
          
          <div className="w-full h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#6b7280' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '11px', fill: '#6b7280' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid #c3c6d7', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#004ac6"
                  strokeWidth={2.5}
                  dot={{ r: 4, stroke: '#004ac6', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fulfillment Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)] flex flex-col">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-6">Order Fulfillment</h3>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-on-surface">Pending</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{pendingCount}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-on-surface">Processing</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{processingCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-on-surface">Shipped</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{shippedCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-on-surface">Delivered</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{deliveredCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer mt-auto" onClick={() => navigate('/admin/orders')}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-error" />
                <span className="text-xs font-semibold text-on-surface">Cancelled</span>
              </div>
              <span className="text-xs font-bold text-on-surface">{cancelledCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Orders Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface text-secondary text-xs font-semibold">
                  <th className="p-4 uppercase tracking-wider">Order ID</th>
                  <th className="p-4 uppercase tracking-wider">Customer</th>
                  <th className="p-4 uppercase tracking-wider text-right">Amount</th>
                  <th className="p-4 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-outline-variant/30 text-on-surface">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface transition-colors">
                    <td className="p-4 font-semibold text-primary">{order.id}</td>
                    <td className="p-4 text-on-surface-variant">{order.customerName}</td>
                    <td className="p-4 text-right font-semibold">${order.amount.toFixed(2)}</td>
                    <td className="p-4">{getOrderStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Low Stock Alerts</h3>
            <Link to="/admin/products" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              Manage Inventory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface text-secondary text-xs font-semibold">
                  <th className="p-4 uppercase tracking-wider">Product</th>
                  <th className="p-4 uppercase tracking-wider">Variant</th>
                  <th className="p-4 uppercase tracking-wider text-right">Stock</th>
                  <th className="p-4 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-outline-variant/30 text-on-surface">
                {displayLowStock.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface transition-colors">
                    <td className="p-4 font-semibold">{item.name}</td>
                    <td className="p-4 text-on-surface-variant">{item.variantName}</td>
                    <td className="p-4 text-right font-bold text-error">{item.stock}</td>
                    <td className="p-4">{getStockStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewPage;
