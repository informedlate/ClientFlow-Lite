import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { stripeService } from '@/lib/stripe-service';

// GET /api/invoices - Retrieve all invoices for a client
export async function GET(request: NextRequest) {
    try {
          const authHeader = request.headers.get('authorization');
          if (!authHeader?.startsWith('Bearer ')) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

      const searchParams = request.nextUrl.searchParams;
          const clientId = searchParams.get('clientId');
          const status = searchParams.get('status');

      if (!clientId) {
              return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
      }

      // Fetch invoices from database
      let query = supabase
            .from('invoices')
            .select('*')
            .eq('client_id', clientId);

      if (status) {
              query = query.eq('status', status);
      }

      const { data: invoices, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return NextResponse.json({ invoices });
    } catch (error) {
          console.error('Error fetching invoices:', error);
          return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
    try {
          const authHeader = request.headers.get('authorization');
          if (!authHeader?.startsWith('Bearer ')) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

      const body = await request.json();
          const { projectId, clientId, amount, description, dueDate } = body;

      if (!projectId || !clientId || !amount || !description) {
              return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // Create invoice in Stripe
      const stripeInvoice = await stripeService.createInvoice(
              projectId,
              clientId,
              amount,
              description,
              dueDate
            );

      // Store invoice in database
      const { data: invoice, error } = await supabase
            .from('invoices')
            .insert([
              {
                          client_id: clientId,
                          project_id: projectId,
                          stripe_invoice_id: stripeInvoice.id,
                          amount,
                          description,
                          due_date: dueDate,
                          status: 'draft',
                          created_at: new Date().toISOString(),
              },
                    ])
            .select();

      if (error) throw error;

      return NextResponse.json({ invoice: invoice[0] }, { status: 201 });
    } catch (error) {
          console.error('Error creating invoice:', error);
          return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }
}

// PATCH /api/invoices/:id - Update invoice status
export async function PATCH(request: NextRequest) {
    try {
          const authHeader = request.headers.get('authorization');
          if (!authHeader?.startsWith('Bearer ')) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

      const body = await request.json();
          const { id, action } = body;

      if (!id || !action) {
              return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
      }

      // Get invoice details
      const { data: invoice, error: fetchError } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', id)
            .single();

      if (fetchError) throw fetchError;

      let updateData: any = {};

      if (action === 'send') {
              await stripeService.sendInvoice(invoice.stripe_invoice_id);
              updateData.status = 'sent';
      } else if (action === 'void') {
              updateData.status = 'voided';
      }

      const { data: updated, error: updateError } = await supabase
            .from('invoices')
            .update(updateData)
            .eq('id', id)
            .select();

      if (updateError) throw updateError;

      return NextResponse.json({ invoice: updated[0] });
    } catch (error) {
          console.error('Error updating invoice:', error);
          return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }
}
