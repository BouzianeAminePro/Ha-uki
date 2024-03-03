import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/game"];
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

    // if (gamePathIdRegex.test(request.nextUrl.pathname)) {
    //   const [id, ..._] = request.nextUrl.pathname.split("/").reverse();
    //   console.log(token?.user?.Game);
    //   console.log(id);
    //   if (token?.user?.Game?.every((game) => id !== game?.id)) {
    //     return NextResponse.redirect(new URL("/game", request.url));
    //   }
    // }
  }

  return NextResponse.next();
}
