import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/game", "/profile", "/join"];
// const gamePathIdRegex = /^\/game\/\w+/;

export async function middleware(request: NextRequest & { user: any }) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (
    PROTECTED_ROUTES.some((route) => request.nextUrl.pathname.includes(route))
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    // TODO if you're neither the creator of the game or neither invited to it you can't access to it
  }

  return NextResponse.next();
}
