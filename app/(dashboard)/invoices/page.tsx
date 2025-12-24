'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Invoice {
    id: string;
    project_id: string;
    client_id: string;
    stripe_invoice_id: string;
    amount: number;
    description: string;
    status: 'draft' | 'sent' | 'paid' | 'voided' | 'overdue';
    due_date: string;
    created_at: string;
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');
    const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());

  useEffect(() => {
        fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
        try {
                setLoading(true);
                const response = await fetch('/api/invoices', {
                          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await response.json();
                setInvoices(data.invoices || []);
        } catch (error) {
                console.error('Error fetching invoices:', error);
        } finally {
                setLoading(false);
        }
  };

  const filteredInvoices = filter === 'all' 
    ? invoices 
        : invoices.filter(inv => inv.status === filter);

  const handleSelectInvoice = (id: string) => {
        const newSelected = new Set(selectedInvoices);
        if (newSelected.has(id)) {
                newSelected.delete(id);
        } else {
                newSelected.add(id);
        }
        setSelectedInvoices(newSelected);
  };

  const handleSendInvoice = async (id: string) => {
        try {
                const response = await fetch('/api/invoices', {
                          method: 'PATCH',
                          headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                          },
                          body: JSON.stringify({ id, action: 'send' }),
                });

          if (response.ok) {
                    fetchInvoices();
          }
        } catch (error) {
                console.error('Error sending invoice:', error);
        }
  };

  const getStatusColor = (status: string) => {
        switch (status) {
          case 'paid':
                    return 'bg-green-900 text-green-200';
          case 'sent':
                    return 'bg-blue-900 text-blue-200';
          case 'overdue':
                    return 'bg-red-900 text-red-200';
          case 'draft':
                    return 'bg-slate-700 text-slate-200';
          case 'voided':
                    return 'bg-slate-800 text-slate-300';
          default:
                    return 'bg-slate-700 text-slate-200';
        }
  };

  return (
        <div className="space-y-6">
              <div className="flex items-center justify-between">
                      <div>
                                <h1 className="text-3xl font-bold text-white">Invoices</h1>h1>
                                <p className="text-slate-400 mt-1">Manage and track invoice payments</p>p>
                      </div>div>
                      <Link href="/invoices/new">
                                <Button className="bg-indigo-600 hover:bg-indigo-700">
                                            Create Invoice
                                </Button>Button>
                      </Link>Link>
              </div>div>
        
          {/* Filter Tabs */}
              <div className="flex gap-2 border-b border-slate-700">
                {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((status) => (
                    <button
                                  key={status}
                                  onClick={() => setFilter(status)}
                                  className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                                                  filter === status
                                                    ? 'border-indigo-500 text-indigo-400'
                                                    : 'border-transparent text-slate-400 hover:text-slate-300'
                                  }`}
                                >
                      {status.charAt(0).toUpperCase() + status.slice(1)} ({
                                      filter === status 
                                        ? filteredInvoices.length 
                                        : invoices.filter(inv => inv.status === status || status === 'all').length
                      })
                    </button>button>
                  ))}
              </div>div>
        
          {/* Invoices Table */}
          {loading ? (
                  <Card className="bg-slate-900 border-slate-700 p-8">
                            <p className="text-slate-400 text-center">Loading invoices...</p>p>
                  </Card>Card>
                ) : filteredInvoices.length === 0 ? (
                  <Card className="bg-slate-900 border-slate-700 p-8">
                            <p className="text-slate-400 text-center">No invoices found</p>p>
                  </Card>Card>
                ) : (
                  <Card className="bg-slate-900 border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                        <table className="w-full">
                                                      <thead className="bg-slate-800 border-b border-slate-700">
                                                                      <tr>
                                                                                        <th className="px-6 py-3 text-left">
                                                                                                            <input
                                                                                                                                    type="checkbox"
                                                                                                                                    checked={selectedInvoices.size === filteredInvoices.length}
                                                                                                                                    onChange={(e) => {
                                                                                                                                                              if (e.target.checked) {
                                                                                                                                                                                          setSelectedInvoices(new Set(filteredInvoices.map(inv => inv.id)));
                                                                                                                                                                } else {
                                                                                                                                                                                          setSelectedInvoices(new Set());
                                                                                                                                                                }
                                                                                                                                      }}
                                                                                                                                    className="w-4 h-4"
                                                                                                                                  />
                                                                                          </th>th>
                                                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Invoice ID</th>th>
                                                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Description</th>th>
                                                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Amount</th>th>
                                                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Due Date</th>th>
                                                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Status</th>th>
                                                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Actions</th>th>
                                                                      </tr>tr>
                                                      </thead>thead>
                                                      <tbody className="divide-y divide-slate-700">
                                                        {filteredInvoices.map((invoice) => (
                                      <tr key={invoice.id} className="hover:bg-slate-800 transition">
                                                          <td className="px-6 py-4">
                                                                                <input
                                                                                                          type="checkbox"
                                                                                                          checked={selectedInvoices.has(invoice.id)}
                                                                                                          onChange={() => handleSelectInvoice(invoice.id)}
                                                                                                          className="w-4 h-4"
                                                                                                        />
                                                          </td>td>
                                                          <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                                                            {invoice.stripe_invoice_id.slice(0, 12)}...
                                                          </td>td>
                                                          <td className="px-6 py-4 text-sm text-slate-300">{invoice.description}</td>td>
                                                          <td className="px-6 py-4 text-sm text-slate-300 font-semibold">
                                                            {formatCurrency(invoice.amount)}
                                                          </td>td>
                                                          <td className="px-6 py-4 text-sm text-slate-400">
                                                            {formatDate(invoice.due_date)}
                                                          </td>td>
                                                          <td className="px-6 py-4">
                                                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                                                                                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                                                                  </span>span>
                                                          </td>td>
                                                          <td className="px-6 py-4 text-sm space-x-2">
                                                            {invoice.status === 'draft' && (
                                                                <button
                                                                                            onClick={() => handleSendInvoice(invoice.id)}
                                                                                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                                                                                          >
                                                                                          Send
                                                                </button>button>
                                                                                )}
                                                            {invoice.status === 'sent' && (
                                                                <span className="text-slate-500">Awaiting payment</span>span>
                                                                                )}
                                                            {invoice.status === 'paid' && (
                                                                <span className="text-green-400">Completed</span>span>
                                                                                )}
                                                          </td>td>
                                      </tr>tr>
                                    ))}
                                                      </tbody>tbody>
                                        </table>table>
                            </div>div>
                  </Card>Card>
              )}
        
          {/* Bulk Actions */}
          {selectedInvoices.size > 0 && (
                  <Card className="bg-slate-900 border-slate-700 p-4 flex items-center justify-between">
                            <span className="text-slate-400">
                              {selectedInvoices.size} invoice{selectedInvoices.size !== 1 ? 's' : ''} selected
                            </span>span>
                            <div className="space-x-3">
                                        <Button variant="secondary" onClick={() => setSelectedInvoices(new Set())}>
                                                      Cancel
                                        </Button>Button>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                                                      Send Selected
                                        </Button>Button>
                            </div>div>
                  </Card>Card>
              )}
        </div>div>
      );
}</div>
