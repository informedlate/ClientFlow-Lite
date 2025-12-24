'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface PaymentFormProps {
    invoiceId: string;
    amount: number;
    clientId: string;
    onSuccess?: () => void;
}

export function PaymentForm({ invoiceId, amount, clientId, onSuccess }: PaymentFormProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cardElement, setCardElement] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        try {
                // Create payment intent
          const intentResponse = await fetch('/api/payments', {
                    method: 'POST',
                    headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                                action: 'createPaymentIntent',
                                amount,
                                clientId,
                                projectId: invoiceId,
                    }),
          });

          const intentData = await intentResponse.json();

          if (!intentResponse.ok) {
                    throw new Error(intentData.error || 'Failed to create payment intent');
          }

          // Confirm payment with client secret
          const confirmResponse = await fetch('/api/payments', {
                    method: 'POST',
                    headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                                action: 'confirmPayment',
                                paymentIntentId: intentData.paymentIntent.id,
                    }),
          });

          const confirmData = await confirmResponse.json();

          if (!confirmResponse.ok) {
                    throw new Error(confirmData.error || 'Payment confirmation failed');
          }

          // Success
          onSuccess?.();
                setError(null);
        } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
                setIsProcessing(false);
        }
  };

  return (
        <Card className="bg-slate-900 border-slate-700 p-6 max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Payment Details</h3>h3>
        
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount Display */}
                      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <p className="text-sm text-slate-400 mb-1">Total Amount</p>p>
                                <p className="text-3xl font-bold text-indigo-400">
                                            ${(amount / 100).toFixed(2)}
                                </p>p>
                      </div>div>
              
                {/* Card Details Note */}
                      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <p className="text-sm text-slate-300 mb-2">Payment Method</p>p>
                                <p className="text-sm text-slate-400 mb-3">
                                            In production, this would integrate with Stripe Elements for secure card processing
                                </p>p>
                                <div className="space-y-3">
                                            <Input
                                                            type="text"
                                                            placeholder="John Doe"
                                                            label="Cardholder Name"
                                                            disabled={isProcessing}
                                                            className="bg-slate-900 border-slate-600 text-white"
                                                          />
                                            <Input
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            label="Email"
                                                            disabled={isProcessing}
                                                            className="bg-slate-900 border-slate-600 text-white"
                                                          />
                                </div>div>
                      </div>div>
              
                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                                <p className="text-red-300 text-sm">{error}</p>p>
                    </div>div>
                      )}
              
                {/* Submit Button */}
                      <Button
                                  type="submit"
                                  disabled={isProcessing}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
                                >
                        {isProcessing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
                      </Button>Button>
              
                {/* Security Note */}
                      <p className="text-xs text-slate-500 text-center">
                                Secured by Stripe • Your payment information is encrypted
                      </p>p>
              </form>form>
        </Card>Card>
      );
}</Card>
