import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

  try {
        await supabase.auth.getSession();
  } catch (error) {
        console.error('Middleware auth error:', error);
  }

  // Get the current pathname
  const { pathname } = req.nextUrl;

  // Define public routes
  const publicRoutes = ['/login', '/signup', '/auth'];
    const dashboardRoutes = ['/dashboard', '/clients', '/documents', '/analytics'];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Check if current route is a protected dashboard route
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  // Get session
  const { data: { session } } = await supabase.auth.getSession();

  // If trying to access dashboard route without session, redirect to login
  if (isDashboardRoute && !session) {
        return NextResponse.redirect(new URL('/login', req.url));
  }

  // If trying to access public auth routes with session, redirect to dashboard
  if (isPublicRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
    matcher: [
          '/((?!_next/static|_next/image|favicon.ico).*)',
        ],
};
