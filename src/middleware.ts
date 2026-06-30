import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // 1. If user IS logged in and tries to access auth pages, send them to dashboard
  if (
    token && (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify")
    )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. If user IS NOT logged in and tries to access the dashboard, send them to sign-in
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow the request to proceed normally if none of the conditions match
  return NextResponse.next();
}

export const config = {
  // Added "/dashboard/:path*" with correct spelling
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};