import { withAuth } from "next-auth/middleware";

// Simple middleware protection to require authentication for dashboard routes
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Protect only dashboard routes, leave authentication pages accessible
export const config = {
  matcher: ["/dashboard/:path*"],
};
