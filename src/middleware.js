import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = ['/home', '/bookmarks', '/settings', '/profile', '/(modals)/profile'];
  
  // Auth routes
  const authRoutes = ['/', '/auth/login', '/auth/signup'];

  // Handle protected routes first
  if (protectedRoutes.includes(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // Handle auth routes when user is already logged in
  if (authRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Only check for user profile routes if it's not a protected or auth route
  if (!protectedRoutes.includes(pathname) && !authRoutes.includes(pathname)) {
    // Check if it's a user profile route (e.g., /@username or /username)
    const isUserRoute = pathname.match(/^\/(@)?[a-zA-Z0-9_-]+$/);
    
    if (isUserRoute) {
      const username = pathname.replace(/^\/(@)?/, '');
      const { data: userData } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (!userData) {
        // If username doesn't exist, redirect to 404 page
        return NextResponse.redirect(new URL('/404', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home', 
    '/profile', 
    '/settings', 
    '/auth/login', 
    '/auth/signup',
    '/:username*' // Add matcher for username routes
  ]
};