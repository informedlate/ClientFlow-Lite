'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Input } from '@/components/Input';

interface Client {
    id: string;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function ClientDetailPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
          name: '',
          email: '',
          company: '',
          phone: '',
    });

  useEffect(() => {
        const fetchClient = async () => {
                try {
                          const response = await fetch(`/api/clients/${clientId}`);
                          if (!response.ok) throw new Error('Failed to fetch client');
                          const data = await response.json();
                          setClient(data);
                          setFormData({
                                      name: data.name,
                                      email: data.email,
                                      company: data.company || '',
                                      phone: data.phone || '',
                          });
                } catch (err) {
                          setError(err instanceof Error ? err.message : 'Unknown error');
                } finally {
                          setLoading(false);
                }
        };

                if (clientId) {
                        fetchClient();
                }
  }, [clientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
        try {
                const response = await fetch(`/api/clients/${clientId}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(formData),
                });

          if (!response.ok) throw new Error('Failed to update client');
                const updated = await response.json();
                setClient(updated);
                setIsEditing(false);
        } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
        }
  };

  const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this client?')) return;

        try {
                const response = await fetch(`/api/clients/${clientId}`, {
                          method: 'DELETE',
                });

          if (!response.ok) throw new Error('Failed to delete client');
                router.push('/clients');
        } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
        }
  };

  if (loading) {
        return (
                <div className="min-h-screen bg-slate-900 p-8">
                        <p className="text-slate-400">Loading...</p>p>
                </div>div>
              );
  }
  
    if (!client) {
          return (
                  <div className="min-h-screen bg-slate-900 p-8">
                          <p className="text-red-500">{error || 'Client not found'}</p>p>
                          <Button onClick={() => router.push('/clients')} className="mt-4">
                                    Back to Clients
                          </Button>Button>
                  </div>div>
                );
    }
  
    return (
          <div className="min-h-screen bg-slate-900 p-8">
                <div className="max-w-2xl mx-auto">
                        <button
                                    onClick={() => router.push('/clients')}
                                    className="text-indigo-400 hover:text-indigo-300 mb-6"
                                  >
                                  ← Back to Clients
                        </button>button>
                
                  {error && (
                      <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg mb-6">
                        {error}
                      </div>div>
                        )}
                
                        <Card>
                                  <CardHeader>
                                              <h1 className="text-3xl font-bold text-white">
                                                {isEditing ? 'Edit Client' : client.name}
                                              </h1>h1>
                                  </CardHeader>CardHeader>
                                  <CardBody>
                                    {!isEditing ? (
                          <div className="space-y-6">
                                          <div>
                                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                                                Email
                                                            </label>label>
                                                            <p className="text-white">{client.email}</p>p>
                                          </div>div>
                            {client.company && (
                                              <div>
                                                                  <label className="block text-sm font-medium text-slate-400 mb-2">
                                                                                        Company
                                                                  </label>label>
                                                                  <p className="text-white">{client.company}</p>p>
                                              </div>div>
                                          )}
                            {client.phone && (
                                              <div>
                                                                  <label className="block text-sm font-medium text-slate-400 mb-2">
                                                                                        Phone
                                                                  </label>label>
                                                                  <p className="text-white">{client.phone}</p>p>
                                              </div>div>
                                          )}
                                          <div>
                                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                                                Created
                                                            </label>label>
                                                            <p className="text-white">
                                                              {new Date(client.createdAt).toLocaleDateString()}
                                                            </p>p>
                                          </div>div>
                          
                                          <div className="flex gap-4 pt-4">
                                                            <Button onClick={() => setIsEditing(true)}>
                                                                                Edit Client
                                                            </Button>Button>
                                                            <Button
                                                                                  onClick={handleDelete}
                                                                                  className="bg-red-600 hover:bg-red-700"
                                                                                >
                                                                                Delete Client
                                                            </Button>Button>
                                          </div>div>
                          </div>div>
                        ) : (
                          <div className="space-y-4">
                                          <Input
                                                              label="Name"
                                                              name="name"
                                                              value={formData.name}
                                                              onChange={handleInputChange}
                                                            />
                                          <Input
                                                              label="Email"
                                                              name="email"
                                                              type="email"
                                                              value={formData.email}
                                                              onChange={handleInputChange}
                                                            />
                                          <Input
                                                              label="Company"
                                                              name="company"
                                                              value={formData.company}
                                                              onChange={handleInputChange}
                                                            />
                                          <Input
                                                              label="Phone"
                                                              name="phone"
                                                              value={formData.phone}
                                                              onChange={handleInputChange}
                                                            />
                          
                                          <div className="flex gap-4 pt-4">
                                                            <Button onClick={handleSave}>
                                                                                Save Changes
                                                            </Button>Button>
                                                            <Button
                                                                                  onClick={() => setIsEditing(false)}
                                                                                  className="bg-slate-600 hover:bg-slate-700"
                                                                                >
                                                                                Cancel
                                                            </Button>Button>
                                          </div>div>
                          </div>div>
                                              )}
                                  </CardBody>CardBody>
                        </Card>Card>
                </div>div>
          </div>div>
        );
}</div>
