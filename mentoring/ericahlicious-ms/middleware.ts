import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@/types";

const ROLE_PREFIXES: Record<Role, string> = {
  OWNER: "/owner",
  ADMIN: "/admin",
  SUPERVISOR: "/supervisor",
};

const PUBLIC_PATHS = ["/", "/login"];

export default auth(function middleware(req: NextRequest & { auth: { user?: { role?: Role } } | null }) {
  const { pathname } = req.nextUrl;

  // Allow public paths and API routes
  if (
    PUBLIC_PATHS.some((p) => pathname === p) ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/unauthorized"
  ) {
    return NextResponse.next();
  }

  const session = req.auth;

  // Not logged in — redirect to role selection
  if (!session?.user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const role = session.user.role as Role | undefined;
  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const allowedPrefix = ROLE_PREFIXES[role];

  // Redirect to dashboard if at root while logged in
  if (pathname === "/") {
    return NextResponse.redirect(new URL(allowedPrefix, req.url));
  }

  // Block access to other roles' dashboards
  const otherRolePrefixes = Object.values(ROLE_PREFIXES).filter(
    (p) => p !== allowedPrefix
  );
  if (otherRolePrefixes.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
