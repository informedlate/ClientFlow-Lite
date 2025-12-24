import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Handle authentication routes for Supabase
export async function POST(request: NextRequest) {
    try {
          const { action, email, password, name } = await request.json();
          const cookieStore = cookies();
          const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

      if (action === 'signup') {
              // Register new designer
            const { data, error } = await supabase.auth.signUp({
                      email,
                      password,
                      options: {
                                  data: { name, role: 'designer' },
                      },
            });

            if (error) {
                      return NextResponse.json({ error: error.message }, { status: 400 });
            }

            // Create designer profile in database
            if (data.user) {
                      await prisma.designer.create({
                                  data: {
                                                id: data.user.id,
                                                email: data.user.email!,
                                                name,
                                                authProvider: 'email',
                                  },
                      });
            }

            return NextResponse.json({ user: data.user, session: data.session });
      }

      if (action === 'login') {
              const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
              });

            if (error) {
                      return NextResponse.json({ error: error.message }, { status: 401 });
            }

            return NextResponse.json({ user: data.user, session: data.session });
      }

      if (action === 'logout') {
              const { error } = await supabase.auth.signOut();
              if (error) {
                        return NextResponse.json({ error: error.message }, { status: 400 });
              }
              return NextResponse.json({ message: 'Logged out successfully' });
      }

      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    } catch (error) {
          return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
