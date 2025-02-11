// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Retrieve the token from cookies
  const token = req.cookies.get('token');

  // Redirect authenticated users away from /login
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // Protect routes starting with /home
  if (pathname.startsWith('/home') && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Continue with the request if no redirection is needed
  return NextResponse.next();
}

// Apply middleware to relevant routes
export const config = {
  matcher: ['/home/:path*', '/login'],
};
