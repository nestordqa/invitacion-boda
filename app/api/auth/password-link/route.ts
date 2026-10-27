import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// Dominio público del sitio. En Netlify, request.nextUrl.origin puede ser un
// host interno o el de un despliegue concreto, que Supabase no reconoce.
function getSiteOrigin(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "https";
  return host ? `${protocol}://${host}` : request.nextUrl.origin;
}

// Envía un enlace de acceso para crear o recuperar la contraseña del dashboard.
// Solo se envía a correos registrados como administradores de una boda, pero la
// respuesta es siempre la misma para no revelar qué correos existen.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) return Response.json({ error: "Ingresa tu correo electrónico." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_wedding_admin", { p_email: email });
  if (adminError) {
    console.error("[password-link] is_wedding_admin:", adminError.message);
    return Response.json({ error: "No se pudo verificar el correo. Revisa que la migración de contraseñas esté aplicada." }, { status: 500 });
  }

  if (isAdmin) {
    const redirectTo = new URL("/auth/callback?next=/dashboard/set-password", getSiteOrigin(request)).toString();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: redirectTo } });
    if (error) {
      console.error("[password-link] signInWithOtp:", error.status, error.code, error.message);
      if (error.status === 429) return Response.json({ error: "Se enviaron demasiados enlaces. Espera unos minutos y vuelve a intentarlo." }, { status: 429 });
      if (error.code === "signup_disabled") return Response.json({ error: "El registro de usuarios está desactivado en Supabase." }, { status: 500 });
      return Response.json({ error: "No se pudo enviar el enlace. Inténtalo más tarde." }, { status: 500 });
    }
  }

  return Response.json({ message: "Si tu correo está registrado, recibirás un enlace para crear tu contraseña." });
}
