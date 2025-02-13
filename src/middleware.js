// middleware.js
import { NextResponse } from 'next/server';

import{cookies} from 'next/headers'

export async function middleware(req) {
  
  // const cookieStore = await cookies();
  // const token =  cookieStore.get('userRole')?.value;
  // // const token = await req.cookies.get('token')?.value; 
  // console.log(token);

  // console.log('m running')
  // const { pathname } = req.nextUrl;

  // // Retrieve the token from cookies

  // // Redirect authenticated users away from /login
  // if (pathname === '/login' && token) {
  //   console.log('m running 2')

  //   console.log('middleware');
  //   return NextResponse.redirect(new URL('/home', req.url));
  // }

  // // Protect routes starting with /home
  // if (pathname.startsWith('/home') && !token) {
  //   console.log('m running 3')

  //   return NextResponse.redirect(new URL('/login', req.url));
  // }

  // // Continue with the request if no redirection is needed
  return NextResponse.next();
}

// Apply middleware to relevant routes
export const config = {
  matcher: ['/home/:path*', '/login'],
};
