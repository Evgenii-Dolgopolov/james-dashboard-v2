// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"
import { PROTECTED_ROUTES } from "@/auth/constants"

export const middleware = auth(async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const isAuthenticated = !!request.auth
  const session = request.auth

  // Check for protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route),
  )

  // Handle unauthenticated users
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from login page
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard/messages", request.url))
  }

  // Check for bot access on dashboard routes
  if (isAuthenticated && pathname.startsWith("/dashboard")) {
    const userBotAssignments = session?.user?.botAssignments || []

    // If user has no bot assignments
    if (userBotAssignments.length === 0) {
      // You can either redirect to a specific page or show an error
      return NextResponse.redirect(
        new URL("/unauthorized?reason=no-bot-assignments", request.url),
      )
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
