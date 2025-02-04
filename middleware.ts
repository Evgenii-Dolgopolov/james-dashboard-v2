import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { auth } from "@/auth"

// Combine both authentication checks
export const middleware = auth(async (request: NextRequest) => {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/dashboard/users"]

  // Check if the requested path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route),
  )

  // Redirect to login if user is not authenticated and trying to access a protected route
  if (
    (isProtectedRoute && !token) ||
    (!request.auth && pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
})

// Unified matcher configuration
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
}
