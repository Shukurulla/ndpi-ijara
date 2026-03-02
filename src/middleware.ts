import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes that don't need auth
  const publicRoutes = ["/auth", "/user-type", "/"];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check localStorage via client-side redirect for protected routes
  // Middleware can't access localStorage, so we'll handle this client-side
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
