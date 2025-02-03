import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth(req => {
  const { pathname } = req.nextUrl

  // Redirect unauthenticated users to login
  if (!req.auth && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

// Match all routes except static files and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
}
