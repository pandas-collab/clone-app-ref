import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
      // Allow access to login page
      if (pathname === '/admin/login') {
        return NextResponse.next()
      }

      // Require authentication for other admin routes
      if (!token) {
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Require admin role for admin routes (except login)
      if (token.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login?error=access_denied', req.url))
      }
    }

    // Check API routes
    if (pathname.startsWith('/api/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes
        if (
          pathname === '/' ||
          pathname.startsWith('/about') ||
          pathname.startsWith('/services') ||
          pathname.startsWith('/portfolio') ||
          pathname.startsWith('/careers') ||
          pathname.startsWith('/contact') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/_next') ||
          pathname.includes('.')
        ) {
          return true
        }

        // Admin login page - allow without token
        if (pathname === '/admin/login') {
          return true
        }

        // Admin routes require token
        if (pathname.startsWith('/admin')) {
          return !!token
        }

        // Default allow
        return true
      }
    },
    pages: {
      signIn: '/admin/login'
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
}
