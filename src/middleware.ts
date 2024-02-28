import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/game"];

export async function middleware(request: NextRequest & { user: any }) {
  const requestHeaders = new Headers(request.headers);

  // if (request.nextUrl.pathname === "/") {
  //   return NextResponse.redirect(
  //     new URL(`/${process.env.BASE_PATH}/game`, request.url)
  //   );
  // }

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
    console.log("here");
    // return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    //   return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}
