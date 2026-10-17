import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If someone tries to access the main admin dashboard...
  if (request.nextUrl.pathname === '/admin') {
    // Check if they have the secure session cookie
    const hasAccess = request.cookies.has('admin_session')

    // If they don't have the cookie, instantly kick them to the login screen
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Otherwise, let them pass
  return NextResponse.next()
}

// This tells Next.js to only run this bouncer on /admin routes
export const config = {
  matcher: '/admin/:path*',
}