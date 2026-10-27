import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// Envía un enlace de acceso para crear o recuperar la contraseña del dashboard.
// Solo se envía a correos registrados como administradores de una boda, pero la
// respuesta es siempre la misma para no revelar qué correos existen.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) return Response.json({ error: "Ingresa tu correo electrónico." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_wedding_admin", { p_email: email });
  if (adminError) return Response.json({ error: "No se pudo enviar el enlace. Inténtalo más tarde." }, { status: 500 });

  if (isAdmin) {
    const redirectTo = new URL("/auth/callback?next=/dashboard/set-password", request.nextUrl.origin).toString();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: redirectTo } });
    if (error) return Response.json({ error: "No se pudo enviar el enlace. Inténtalo más tarde." }, { status: 500 });
  }

  return Response.json({ message: "Si tu correo está registrado, recibirás un enlace para crear tu contraseña." });
}
