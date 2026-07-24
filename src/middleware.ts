import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/admin'];

// Define admin-only routes
const adminOnlyRoutes = [
  '/admin/services',
  '/admin/portfolio',
  '/admin/careers',
  '/admin/applications'
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/services',
  '/portfolio',
  '/careers',
  '/contact',
  '/admin/login'
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Allow access to public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Check if route requires authentication
    const requiresAuth = protectedRoutes.some(route => pathname.startsWith(route));

    if (requiresAuth && !token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if route requires admin access
    const requiresAdmin = adminOnlyRoutes.some(route => pathname.startsWith(route));

    if (requiresAdmin && token?.role !== 'ADMIN') {
      // Redirect to admin dashboard or show error
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Allow access if all checks pass
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Allow public routes without token
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // Require token for protected routes
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          return !!token;
        }

        // Default to allowing access
        return true;
      },
    },
  }
);

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes except:
    // - API routes (except /api/auth)
    // - Static files
    // - Next.js internals
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ]
};

// Export helper functions for route protection
export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

export function isAdminOnlyRoute(pathname: string): boolean {
  return adminOnlyRoutes.some(route => pathname.startsWith(route));
}

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}
