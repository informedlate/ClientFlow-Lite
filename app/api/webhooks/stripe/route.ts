import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
        console.error('Webhook signature verification failed:', error);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
        switch (event.type) {
          case 'invoice.paid': {
                    const invoice = event.data.object as Stripe.Invoice;
                    const metadata = invoice.metadata;

                    // Update invoice status in database
                    const { error: updateError } = await supabase
                      .from('invoices')
                      .update({ status: 'paid' })
                      .eq('stripe_invoice_id', invoice.id);

                    if (updateError) {
                                console.error('Error updating invoice status:', updateError);
                    }

                    // Update client status to "Ready to Start"
                    if (metadata?.clientId) {
                                const { error: clientError } = await supabase
                                  .from('clients')
                                  .update({ status: 'ready_to_start' })
                                  .eq('id', metadata.clientId);

                      if (clientError) {
                                    console.error('Error updating client status:', clientError);
                      }
                    }
                    break;
          }

          case 'invoice.payment_failed': {
                    const invoice = event.data.object as Stripe.Invoice;

                    // Update invoice status to 'overdue' or send reminder
                    const { error: updateError } = await supabase
                      .from('invoices')
                      .update({ status: 'overdue' })
                      .eq('stripe_invoice_id', invoice.id);

                    if (updateError) {
                                console.error('Error updating invoice status:', updateError);
                    }

                    // Log payment failure for debugging
                    console.log('Payment failed for invoice:', invoice.id);
                    break;
          }

          case 'invoice.overdue': {
                    const invoice = event.data.object as Stripe.Invoice;

                    // Update invoice status to overdue
                    const { error: updateError } = await supabase
                      .from('invoices')
                      .update({ status: 'overdue' })
                      .eq('stripe_invoice_id', invoice.id);

                    if (updateError) {
                                console.error('Error updating invoice status:', updateError);
                    }
                    break;
          }

          case 'payment_intent.succeeded': {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    console.log('Payment intent succeeded:', paymentIntent.id);
                    break;
          }

          case 'payment_intent.payment_failed': {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    console.log('Payment intent failed:', paymentIntent.id);
                    break;
          }

          case 'charge.refunded': {
                    const charge = event.data.object as Stripe.Charge;

                    // Log refund in database
                    if (charge.metadata?.invoiceId) {
                                const { error: refundError } = await supabase
                                  .from('invoice_refunds')
                                  .insert([
                                    {
                                                      invoice_id: charge.metadata.invoiceId,
                                                      stripe_refund_id: charge.refunds?.data[0]?.id || '',
                                                      amount: charge.refunded || 0,
                                                      reason: charge.refunds?.data[0]?.reason || 'manual',
                                                      created_at: new Date().toISOString(),
                                    },
                                                ]);

                      if (refundError) {
                                    console.error('Error logging refund:', refundError);
                      }
                    }
                    break;
          }

          default:
                    console.log('Unhandled event type:', event.type);
        }

      return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
