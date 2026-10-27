import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Si Supabase usa la Site URL como retorno, el enlace del correo llega a "/"
  // con ?code=. Se reenvía al callback para completar el inicio de sesión.
  const code = request.nextUrl.searchParams.get("code");
  if (request.nextUrl.pathname === "/" && code) {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.searchParams.set("code", code);
    callbackUrl.searchParams.set("next", "/dashboard/set-password");
    return NextResponse.redirect(callbackUrl);
  }
  if (!request.nextUrl.pathname.startsWith("/dashboard")) return NextResponse.next();

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
  matcher: ["/", "/dashboard/:path*"],
};
