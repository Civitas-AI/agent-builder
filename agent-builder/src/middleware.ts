// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/agents/:path*',
    // Add any other paths you want to protect.
    // Be careful with very broad matchers like the one you had previously
    // if you don't intend to protect literally everything.
    // For example, to protect all routes *except* specific ones:
    // '/((?!api|_next/static|_next/image|favicon.ico|login|public-page).*)'
  ],
};