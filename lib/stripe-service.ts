import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export interface PaymentSession {
    id: string;
    clientId: string;
    projectId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    stripePaymentIntentId: string;
    createdAt: string;
    completedAt?: string;
}

export interface Invoice {
    id: string;
    projectId: string;
    clientId: string;
    amount: number;
    description: string;
    dueDate: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    invoiceNumber: string;
    stripeInvoiceId?: string;
}

export const stripeService = {
    async createPaymentIntent(
          amount: number,
          clientId: string,
          projectId: string,
          metadata?: Record<string, string>
        ): Promise<PaymentSession> {
          try {
                  const paymentIntent = await stripe.paymentIntents.create({
                            amount: Math.round(amount * 100), // Convert to cents
                            currency: 'usd',
                            metadata: {
                                        clientId,
                                        projectId,
                                        ...metadata
                            }
                  });

            // Store in database
            const { data: session, error } = await supabase
                    .from('payment_sessions')
                    .insert({
                                client_id: clientId,
                                project_id: projectId,
                                amount,
                                currency: 'usd',
                                status: 'pending',
                                stripe_payment_intent_id: paymentIntent.id,
                                created_at: new Date().toISOString()
                    })
                    .select()
                    .single();

            if (error) throw new Error(`Failed to create payment session: ${error.message}`);

            return {
                      id: session.id,
                      clientId: session.client_id,
                      projectId: session.project_id,
                      amount: session.amount,
                      currency: session.currency,
                      status: session.status,
                      stripePaymentIntentId: paymentIntent.id,
                      createdAt: session.created_at
            };
          } catch (error) {
                  console.error('Error creating payment intent:', error);
                  throw error;
          }
    },

    async confirmPayment(paymentIntentId: string): Promise<PaymentSession> {
          try {
                  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status !== 'succeeded') {
                      throw new Error('Payment intent not succeeded');
            }

            // Update database
            const { data: session, error } = await supabase
                    .from('payment_sessions')
                    .update({
                                status: 'completed',
                                completed_at: new Date().toISOString()
                    })
                    .eq('stripe_payment_intent_id', paymentIntentId)
                    .select()
                    .single();

            if (error) throw new Error(`Failed to update payment session: ${error.message}`);

            return {
                      id: session.id,
                      clientId: session.client_id,
                      projectId: session.project_id,
                      amount: session.amount,
                      currency: session.currency,
                      status: session.status,
                      stripePaymentIntentId: paymentIntentId,
                      createdAt: session.created_at,
                      completedAt: session.completed_at
            };
          } catch (error) {
                  console.error('Error confirming payment:', error);
                  throw error;
          }
    },

    async createInvoice(
          projectId: string,
          clientId: string,
          amount: number,
          description: string,
          dueDate: string
        ): Promise<Invoice> {
          try {
                  const invoiceNumber = `INV-${Date.now()}`;

            // Create Stripe invoice
            const stripeInvoice = await stripe.invoices.create({
                      customer: clientId,
                      description,
                      due_date: Math.floor(new Date(dueDate).getTime() / 1000),
                      metadata: {
                                  projectId,
                                  clientId
                      }
            });

            // Store in database
            const { data: invoice, error } = await supabase
                    .from('invoices')
                    .insert({
                                project_id: projectId,
                                client_id: clientId,
                                amount,
                                description,
                                due_date: dueDate,
                                status: 'draft',
                                invoice_number: invoiceNumber,
                                stripe_invoice_id: stripeInvoice.id
                    })
                    .select()
                    .single();

            if (error) throw new Error(`Failed to create invoice: ${error.message}`);

            return {
                      id: invoice.id,
                      projectId: invoice.project_id,
                      clientId: invoice.client_id,
                      amount: invoice.amount,
                      description: invoice.description,
                      dueDate: invoice.due_date,
                      status: invoice.status,
                      invoiceNumber: invoice.invoice_number,
                      stripeInvoiceId: invoice.stripe_invoice_id
            };
          } catch (error) {
                  console.error('Error creating invoice:', error);
                  throw error;
          }
    },

    async sendInvoice(invoiceId: string): Promise<Invoice> {
          try {
                  const { data: invoice, error: fetchError } = await supabase
                    .from('invoices')
                    .select()
                    .eq('id', invoiceId)
                    .single();

            if (fetchError || !invoice) {
                      throw new Error('Invoice not found');
            }

            // Send via Stripe
            if (invoice.stripe_invoice_id) {
                      await stripe.invoices.sendInvoice(invoice.stripe_invoice_id);
            }

            // Update status
            const { data: updated, error: updateError } = await supabase
                    .from('invoices')
                    .update({ status: 'sent' })
                    .eq('id', invoiceId)
                    .select()
                    .single();

            if (updateError) throw new Error(`Failed to update invoice: ${updateError.message}`);

            return {
                      id: updated.id,
                      projectId: updated.project_id,
                      clientId: updated.client_id,
                      amount: updated.amount,
                      description: updated.description,
                      dueDate: updated.due_date,
                      status: updated.status,
                      invoiceNumber: updated.invoice_number,
                      stripeInvoiceId: updated.stripe_invoice_id
            };
          } catch (error) {
                  console.error('Error sending invoice:', error);
                  throw error;
          }
    },

    async refundPayment(paymentIntentId: string, amount?: number): Promise<void> {
          try {
                  const refund = await stripe.refunds.create({
                            payment_intent: paymentIntentId,
                            amount: amount ? Math.round(amount * 100) : undefined
                  });

            // Update database
            await supabase
                    .from('payment_sessions')
                    .update({
                                status: 'refunded'
                    })
                    .eq('stripe_payment_intent_id', paymentIntentId);

            console.log('Refund created:', refund.id);
          } catch (error) {
                  console.error('Error refunding payment:', error);
                  throw error;
          }
    },

    async getPaymentHistory(clientId: string): Promise<PaymentSession[]> {
          try {
                  const { data: sessions, error } = await supabase
                    .from('payment_sessions')
                    .select()
                    .eq('client_id', clientId)
                    .order('created_at', { ascending: false });

            if (error) throw new Error(`Failed to fetch payment history: ${error.message}`);

            return sessions.map((session: any) => ({
                      id: session.id,
                      clientId: session.client_id,
                      projectId: session.project_id,
                      amount: session.amount,
                      currency: session.currency,
                      status: session.status,
                      stripePaymentIntentId: session.stripe_payment_intent_id,
                      createdAt: session.created_at,
                      completedAt: session.completed_at
            }));
          } catch (error) {
                  console.error('Error fetching payment history:', error);
                  throw error;
          }
    }
};
