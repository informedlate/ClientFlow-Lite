import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/stripe-service';

export async function POST(request: NextRequest) {
    try {
          const { action, clientId, projectId, amount, description, dueDate, paymentIntentId } = await request.json();

      // Verify user is authenticated
      const authHeader = request.headers.get('authorization');
          if (!authHeader) {
                  return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                          );
          }

      switch (action) {
        case 'createPaymentIntent':
                  const paymentSession = await stripeService.createPaymentIntent(
                              amount,
                              clientId,
                              projectId,
                    { description }
                            );
                  return NextResponse.json(paymentSession);

        case 'confirmPayment':
                  const confirmed = await stripeService.confirmPayment(paymentIntentId);
                  return NextResponse.json(confirmed);

        case 'createInvoice':
                  const invoice = await stripeService.createInvoice(
                              projectId,
                              clientId,
                              amount,
                              description,
                              dueDate
                            );
                  return NextResponse.json(invoice);

        case 'sendInvoice':
                  const sent = await stripeService.sendInvoice(paymentIntentId);
                  return NextResponse.json(sent);

        case 'refundPayment':
                  await stripeService.refundPayment(paymentIntentId, amount);
                  return NextResponse.json({ success: true });

        case 'getPaymentHistory':
                  const history = await stripeService.getPaymentHistory(clientId);
                  return NextResponse.json(history);

        default:
                  return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                            );
      }
    } catch (error) {
          console.error('Payment API error:', error);
          return NextResponse.json(
            { error: 'Failed to process payment request' },
            { status: 500 }
                );
    }
}
