import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCAL_STORAGE_APP_KEY } from "../config";
import { getActiveUser } from "../storage";

const PROTECTED_ROUTES = ["/dashboard"];

const ADMIN_ROUTES = ["/admin"];

const PUBLIC_ROUTES = ["/login"];

function isAuthenticated(request: NextRequest) {
  const sessionToken = request.cookies.get(LOCAL_STORAGE_APP_KEY);
  return !!sessionToken;
}

function isAdmin(request: NextRequest): string | undefined {
  const activeUser = getActiveUser()?.role;
  return activeUser;
}

export function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl;
  const userIsAuthenticated = isAuthenticated(request);
  const userIsAdmin = isAdmin(request);

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute) {
    if (!userIsAuthenticated || !userIsAdmin) {
      const url = request.nextUrl.clone();
      return NextResponse.redirect(url);
    }
  }

  if (isProtectedRoute) {
    if (!userIsAuthenticated) {
      const url = request.nextUrl.clone();
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
