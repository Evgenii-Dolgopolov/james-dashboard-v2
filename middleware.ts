import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/dashboard/users"]

  // Check if the requested path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route),
  )

  // Redirect to login if user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Allow access to non-protected routes or authenticated users
  return NextResponse.next()
}

// Specify the routes to apply the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login page
     */
    "/((?!_next/static|_next/image|favicon.ico|login).*)",
  ],
}
