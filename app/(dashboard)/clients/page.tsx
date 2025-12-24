'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

interface Client {
    id: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    createdAt: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '' });

  useEffect(() => {
        fetchClients();
  }, []);

  const fetchClients = async () => {
        try {
                const res = await fetch('/api/clients');
                if (!res.ok) throw new Error('Failed to fetch clients');
                const data = await res.json();
                setClients(data);
        } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch clients');
        } finally {
                setLoading(false);
        }
  };

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
                const res = await fetch('/api/clients', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(formData),
                });
                if (!res.ok) throw new Error('Failed to create client');
                const newClient = await res.json();
                setClients([newClient, ...clients]);
                setFormData({ name: '', email: '', company: '', phone: '' });
                setShowForm(false);
        } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to create client');
        }
  };

  if (loading) return <div className="text-center py-8 text-slate-400">Loading clients...</div>div>;
  
    return (
          <div className="space-y-6">
                <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-white">Clients</h1>h1>
                        <Button onClick={() => setShowForm(!showForm)}>
                          {showForm ? 'Cancel' : 'Add Client'}
                        </Button>Button>
                </div>div>
          
            {error && <div className="p-4 bg-red-900/20 border border-red-500 rounded text-red-400">{error}</div>div>}
          
            {showForm && (
                    <Card>
                              <CardHeader>
                                          <h2 className="text-xl font-semibold text-white">Add New Client</h2>h2>
                              </CardHeader>CardHeader>
                              <CardBody>
                                          <form onSubmit={handleSubmit} className="space-y-4">
                                                        <Input
                                                                          label="Client Name"
                                                                          value={formData.name}
                                                                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                          required
                                                                        />
                                                        <Input
                                                                          label="Email"
                                                                          type="email"
                                                                          value={formData.email}
                                                                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                                          required
                                                                        />
                                                        <Input
                                                                          label="Company"
                                                                          value={formData.company}
                                                                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                                        />
                                                        <Input
                                                                          label="Phone"
                                                                          value={formData.phone}
                                                                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                        />
                                                        <Button type="submit" fullWidth>Save Client</Button>Button>
                                          </form>form>
                              </CardBody>CardBody>
                    </Card>Card>
                )}
          
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.length === 0 ? (
                      <div className="col-span-full text-center py-8 text-slate-400">
                                  No clients yet. Create your first client to get started.
                      </div>div>
                    ) : (
                      clients.map((client) => (
                                    <Card key={client.id} elevated>
                                                  <CardBody className="space-y-2">
                                                                  <h3 className="font-semibold text-white">{client.name}</h3>h3>
                                                                  <p className="text-sm text-slate-400">{client.email}</p>p>
                                                    {client.company && <p className="text-sm text-slate-500">{client.company}</p>p>}
                                                    {client.phone && <p className="text-sm text-slate-500">{client.phone}</p>p>}
                                                                  <p className="text-xs text-slate-600 mt-3">
                                                                                    Added: {new Date(client.createdAt).toLocaleDateString()}
                                                                  </p>p>
                                                  </CardBody>CardBody>
                                    </Card>Card>
                                  ))
                    )}
                </div>div>
          </div>div>
        );
}</div>
