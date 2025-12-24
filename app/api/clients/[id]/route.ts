import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET individual client
export async function GET(
    request: NextRequest,
  { params }: { params: { id: string } }
  ) {
    try {
          const client = await prisma.client.findUnique({
                  where: { id: params.id },
          });

      if (!client) {
              return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
                      );
      }

      return NextResponse.json(client);
    } catch (error) {
          console.error('GET /api/clients/[id]:', error);
          return NextResponse.json(
            { error: 'Failed to fetch client' },
            { status: 500 }
                );
    }
}

// UPDATE client
export async function PUT(
    request: NextRequest,
  { params }: { params: { id: string } }
  ) {
    try {
          const body = await request.json();
          const { name, email, company, phone } = body;

      // Validate required fields
      if (!name || !email) {
              return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
                      );
      }

      const client = await prisma.client.update({
              where: { id: params.id },
              data: {
                        name,
                        email,
                        company: company || null,
                        phone: phone || null,
              },
      });

      return NextResponse.json(client);
    } catch (error) {
          console.error('PUT /api/clients/[id]:', error);
          return NextResponse.json(
            { error: 'Failed to update client' },
            { status: 500 }
                );
    }
}

// DELETE client
export async function DELETE(
    request: NextRequest,
  { params }: { params: { id: string } }
  ) {
    try {
          // Check if client exists
      const client = await prisma.client.findUnique({
              where: { id: params.id },
      });

      if (!client) {
              return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
                      );
      }

      // Delete the client
      await prisma.client.delete({
              where: { id: params.id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
          console.error('DELETE /api/clients/[id]:', error);
          return NextResponse.json(
            { error: 'Failed to delete client' },
            { status: 500 }
                );
    }
}
