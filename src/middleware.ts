import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/game"];

export async function middleware(request: NextRequest & { user: any }) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (
    PROTECTED_ROUTES.some((route) =>
      request.nextUrl.pathname.includes(route)
    ) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  return NextResponse.next();
}
