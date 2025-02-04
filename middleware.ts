// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"
import { PROTECTED_ROUTES } from "@/auth/constants"

export const middleware = auth(async (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const isAuthenticated = !!request.auth

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route),
  )

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from login page
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
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
