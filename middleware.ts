import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { auth } from "@/auth"
import { PROTECTED_ROUTES } from "@/auth/constants"

export const middleware = auth(async (request: NextRequest) => {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route),
  )

  if (isProtectedRoute && (!token || !request.auth)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
}
