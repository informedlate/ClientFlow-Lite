import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function GET(request: NextRequest) {
    try {
          const { data: { user } } = await supabase.auth.admin.getUserByCookie(request.cookies.getSetCookie()[0] || '');

      if (!user) {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const clients = await prisma.client.findMany({
              where: { userId: user.id },
              orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(clients);
    } catch (error) {
          console.error('Error fetching clients:', error);
          return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
          const { data: { user } } = await supabase.auth.admin.getUserByCookie(request.cookies.getSetCookie()[0] || '');

      if (!user) {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const body = await request.json();
          const { name, email, company, phone } = body;

      if (!name || !email) {
              return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
      }

      const client = await prisma.client.create({
              data: {
                        name,
                        email,
                        company,
                        phone,
                        userId: user.id,
              },
      });

      return NextResponse.json(client, { status: 201 });
    } catch (error) {
          console.error('Error creating client:', error);
          return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
    }
}
