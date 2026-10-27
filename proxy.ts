import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const isLoginPage = request.nextUrl.pathname === "/dashboard/login";

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
