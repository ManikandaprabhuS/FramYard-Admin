import React, { useState } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import { DataTable } from '../../components/tables/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, MoreVertical, Mail, Phone } from 'lucide-react';
import { Customer } from '../../types';

export const CustomersPage: React.FC = () => {
  const { customers, loading } = useCustomers(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeType = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'new':
        return 'info';
      case 'inactive':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const headers = [
    { key: 'name', label: 'Customer Name' },
    { key: 'contact', label: 'Contact Info' },
    { key: 'orders', label: 'Orders' },
    { key: 'spent', label: 'Total Spent' },
    { key: 'joined', label: 'Joined Date' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'right' as const },
  ];

  const renderRow = (customer: Customer) => (
    <tr key={customer.id} className="hover:bg-surface-variant/20 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            {customer.name.charAt(0)}
          </div>
          <span className="font-medium text-on-surface">{customer.name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> {customer.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5" /> {customer.phone}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-on-surface">{customer.ordersCount}</td>
      <td className="px-6 py-4 font-medium text-on-surface">${customer.totalSpent.toFixed(2)}</td>
      <td className="px-6 py-4 text-on-surface-variant text-sm">{new Date(customer.joinedDate).toLocaleDateString()}</td>
      <td className="px-6 py-4">
        <Badge type={getStatusBadgeType(customer.status) as any}>{customer.status}</Badge>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );

  const renderCard = (customer: Customer) => (
    <div key={customer.id} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-on-surface">{customer.name}</h4>
            <Badge type={getStatusBadgeType(customer.status) as any} className="mt-1">{customer.status}</Badge>
          </div>
        </div>
        <button className="p-2 text-on-surface-variant hover:text-primary rounded-full">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col gap-1 text-sm text-on-surface-variant mt-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" /> {customer.email}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" /> {customer.phone}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 pt-3 border-t border-outline-variant">
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider">Orders</span>
          <span className="font-medium text-on-surface">{customer.ordersCount}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider">Total Spent</span>
          <span className="font-semibold text-primary">${customer.totalSpent.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full h-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Customers</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage your customer base and view their activity.</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant rounded-xl text-sm font-medium hover:bg-surface-variant transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <DataTable
        headers={headers}
        items={filteredCustomers}
        renderRow={renderRow}
        renderCard={renderCard}
        loading={loading}
        emptyTitle="No customers found"
        emptyMessage={searchTerm ? `No customers match "${searchTerm}".` : "You don't have any customers yet."}
      />
    </div>
  );
};

export default CustomersPage;
