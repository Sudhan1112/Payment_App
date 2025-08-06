import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/users")) {
          return token?.role === "admin"
        }

        // Protect authenticated routes
        if (
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/profile") ||
          req.nextUrl.pathname.startsWith("/payments") ||
          req.nextUrl.pathname.startsWith("/analytics") ||
          req.nextUrl.pathname.startsWith("/settings")
        ) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/payments/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/users/:path*",
  ],
}
