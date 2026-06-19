import React, { useEffect, useState } from 'react';
import useOrders from '../../hooks/useOrders';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Search, Calendar, Filter, Plus, ArrowRight, Eye, Mail, Phone, ShoppingCart } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

export const OrdersPage: React.FC = () => {
  const { orders, loading, fetchOrders, changeOrderStatus, addOrder } = useOrders(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  // Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // New Order State
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [itemsCount, setItemsCount] = useState('1');
  const [orderAmount, setOrderAmount] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // KPI Calculations
  const totalCount = orders.length + 1244;
  const pendingCount = orders.filter(o => o.status === 'pending').length + 41;
  const processingCount = orders.filter(o => o.status === 'processing').length + 84;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length + 1092;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length + 24;

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await changeOrderStatus(orderId, newStatus);
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm);
      
    const matchesStatus = 
      statusFilter === 'all' || 
      o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !orderAmount) return;

    const payload = {
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone || 'Not Provided',
      itemsCount: parseInt(itemsCount) || 1,
      amount: parseFloat(orderAmount),
      status: 'pending' as const,
      items: [
        {
          id: 'oi-' + Math.random().toString(36).substr(2, 5),
          productName: 'Nordic Oak Gallery',
          variantName: '11" x 14" (Natural Oak)',
          quantity: parseInt(itemsCount) || 1,
          price: parseFloat(orderAmount) / (parseInt(itemsCount) || 1),
        }
      ]
    };

    const success = await addOrder(payload);
    if (success) {
      setNewOrderModalOpen(false);
      setCustName('');
      setCustEmail('');
      setCustPhone('');
      setItemsCount('1');
      setOrderAmount('');
    }
  };

  const getDropdownStyles = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-surface-container-highest text-on-surface';
      case 'processing':
        return 'bg-primary-container text-on-primary-container';
      case 'delivered':
        return 'bg-tertiary-container text-on-tertiary-container';
      case 'cancelled':
        return 'bg-error-container text-on-error-container';
      default:
        return 'bg-surface text-on-surface';
    }
  };

  const headers = [
    { key: 'id', label: 'Order ID', w: '24' },
    { key: 'customer', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'items', label: 'Items', align: 'right' as const },
    { key: 'amount', label: 'Amount', align: 'right' as const },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' },
    { key: 'actions', label: 'Actions', align: 'right' as const },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Orders Management</h2>
          <p className="text-sm text-secondary mt-1">View, track, and manage all customer orders.</p>
        </div>
        <button
          onClick={() => setNewOrderModalOpen(true)}
          className="bg-primary text-on-primary font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-sm flex items-center justify-center gap-1.5 h-10 hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-secondary uppercase">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-xl font-bold text-on-surface">{totalCount.toLocaleString('en-US')}</div>
          <div className="text-[10px] text-tertiary mt-1 flex items-center gap-0.5">
            <span className="font-semibold">+12%</span> this month
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-secondary uppercase">Pending</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-xl font-bold text-on-surface">{pendingCount}</div>
          <div className="text-[10px] text-secondary mt-1">Requires review</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-secondary uppercase">Processing</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          </div>
          <div className="text-xl font-bold text-on-surface">{processingCount}</div>
          <div className="text-[10px] text-secondary mt-1">In fulfillment</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-secondary uppercase">Delivered</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          </div>
          <div className="text-xl font-bold text-on-surface">{deliveredCount}</div>
          <div className="text-[10px] text-secondary mt-1">Completed</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-secondary uppercase">Cancelled</span>
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
          </div>
          <div className="text-xl font-bold text-on-surface">{cancelledCount}</div>
          <div className="text-[10px] text-secondary mt-1">Refunded</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-outline-variant bg-surface-bright flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="flex items-center bg-surface border border-outline-variant rounded-lg px-3 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 w-full sm:w-64 transition-all">
              <Search className="w-4 h-4 text-outline-variant mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs text-on-surface placeholder:text-outline-variant/80 p-0 focus:ring-0"
                placeholder="Order ID, Customer, Phone..."
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative w-full sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Mock Calendar Date */}
            <div className="flex items-center bg-surface border border-outline-variant rounded-lg px-3 py-1.5 cursor-pointer hover:border-outline transition-colors w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-outline-variant mr-2" />
              <span className="text-xs text-on-surface">Last 30 Days</span>
            </div>
          </div>
          
          <button className="text-secondary hover:text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors self-end md:self-auto">
            <Filter className="w-3.5 h-3.5" /> More Filters
          </button>
        </div>

        {/* Orders Table */}
        <DataTable
          headers={headers}
          items={filteredOrders}
          loading={loading}
          emptyTitle="No orders found"
          emptyMessage="No customer orders match your search filters. Try selecting a different status."
          
          // Desktop Row Renderer
          renderRow={(order) => (
            <tr key={order.id} className="border-b border-outline-variant hover:bg-surface/30 transition-colors group">
              <td 
                onClick={() => openOrderDetails(order)}
                className="px-6 py-4 font-semibold text-primary cursor-pointer hover:underline"
              >
                {order.id}
              </td>
              <td className="px-6 py-4">
                <div className="font-semibold text-on-surface">{order.customerName}</div>
                <div className="text-[11px] text-secondary mt-0.5">{order.customerEmail}</div>
              </td>
              <td className="px-6 py-4 text-on-surface-variant">{order.customerPhone}</td>
              <td className="px-6 py-4 text-right font-medium">{order.itemsCount}</td>
              <td className="px-6 py-4 text-right font-bold text-on-surface">${order.amount.toFixed(2)}</td>
              <td className="px-6 py-4">
                {/* Styled Select Dropdown matching Stitch badge layout */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className={`text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border-none focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none text-center ${getDropdownStyles(
                    order.status
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-6 py-4 text-on-surface-variant">{new Date(order.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => openOrderDetails(order)}
                  className="text-secondary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          )}

          // Mobile Card Renderer
          renderCard={(order) => (
            <div key={order.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-3 relative group">
              <div className="flex justify-between items-start">
                <div>
                  <span 
                    onClick={() => openOrderDetails(order)}
                    className="text-xs font-bold text-primary cursor-pointer hover:underline"
                  >
                    {order.id}
                  </span>
                  <div className="text-sm font-semibold text-on-surface mt-1">{order.customerName}</div>
                </div>
                {/* Status select dropdown on mobile card */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border-none focus:ring-2 focus:ring-primary outline-none cursor-pointer ${getDropdownStyles(
                    order.status
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant pt-1">
                <div>
                  <span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">Date</span>
                  <span className="font-medium text-on-surface">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-on-surface-variant/60 uppercase font-semibold">Total Amount</span>
                  <span className="font-bold text-on-surface">${order.amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
                <span className="text-xs text-on-surface-variant">{order.itemsCount} Items purchased</span>
                <button 
                  onClick={() => openOrderDetails(order)}
                  className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                >
                  <span>Details</span> <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ORDER DETAILS MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Order Details: ${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            
            {/* Customer Info Card */}
            <div className="bg-surface p-4 rounded-xl border border-outline-variant">
              <h4 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider mb-3">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-on-surface-variant/70 block">Name</span>
                  <span className="font-semibold text-on-surface mt-0.5 block">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant/70 block">Email Address</span>
                  <span className="font-semibold text-on-surface mt-0.5 block flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-on-surface-variant" />
                    {selectedOrder.customerEmail}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant/70 block">Phone Number</span>
                  <span className="font-semibold text-on-surface mt-0.5 block flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-on-surface-variant" />
                    {selectedOrder.customerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Purchased list */}
            <div>
              <h4 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider mb-3">Items Purchased</h4>
              <div className="border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant/40 bg-surface-container-lowest">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{item.productName}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Variant: {item.variantName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-on-surface">${item.price.toFixed(2)}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary details */}
            <div className="border-t border-outline-variant pt-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block">Order Date</span>
                <span className="text-sm font-medium text-on-surface mt-0.5 block">
                  {new Date(selectedOrder.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-on-surface-variant block">Total Price</span>
                <span className="text-lg font-bold text-primary mt-0.5 block">
                  ${selectedOrder.amount.toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* CREATE ORDER MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={newOrderModalOpen}
        onClose={() => setNewOrderModalOpen(false)}
        title="Create New Order"
        footer={
          <>
            <button 
              type="button" 
              onClick={() => setNewOrderModalOpen(false)}
              className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold hover:bg-surface"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleCreateOrder}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary/95"
            >
              Submit Order
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateOrder} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Customer Name</label>
            <input 
              type="text" 
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. Johnathan Doe"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              value={custEmail}
              onChange={(e) => setCustEmail(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. john@domain.com"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={custPhone}
              onChange={(e) => setCustPhone(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. (555) 019-2834"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Quantity of Items</label>
            <input 
              type="number" 
              value={itemsCount}
              onChange={(e) => setItemsCount(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Amount ($)</label>
            <input 
              type="number" 
              value={orderAmount}
              onChange={(e) => setOrderAmount(e.target.value)}
              className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. 245.00"
              required
            />
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default OrdersPage;
