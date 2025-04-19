import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Get the pathname from the URL
  const path = request.nextUrl.pathname

  // If the user is not logged in and trying to access a protected route, redirect to login
  if (!token && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is logged in and trying to access login page, redirect to dashboard
  if (token && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Role-based access control
  if (token) {
    const role = token.role as string

    // Admin can access everything
    if (role === "admin") {
      return NextResponse.next()
    }

    // Professor can only access their routes
    if (role === "professor") {
      if (path === "/dashboard" || path.startsWith("/professor/") || path === "/profile") {
        return NextResponse.next()
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // Student can only access their routes
    if (role === "student") {
      if (path === "/dashboard" || path.startsWith("/student/") || path === "/profile") {
        return NextResponse.next()
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
