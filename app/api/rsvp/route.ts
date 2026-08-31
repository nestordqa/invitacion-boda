import { createClient } from "@/utils/supabase/server";
import { isRsvpOpen } from "@/utils/wedding";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const confirmations = ["confirmed", "declined"] as const;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return Response.json({ error: "Invitación no encontrada." }, { status: 404 });

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("guests")
    .select("name, family, passes_number, confirmation, used_passes_confirmed, guest_observation")
    .eq("invitation_token", token)
    .maybeSingle();

  if (error || !data) return Response.json({ error: "Invitación no encontrada." }, { status: 404 });
  return Response.json({ guest: data });
}

export async function PATCH(request: NextRequest) {
  if (!isRsvpOpen()) return Response.json({ error: "El plazo para confirmar ya finalizó." }, { status: 403 });

  const body = await request.json();
  const token = typeof body.token === "string" ? body.token : "";
  const confirmation = body.confirmation;
  const usedPasses = Number(body.used_passes_confirmed);

  if (!token || !confirmations.includes(confirmation) || !Number.isInteger(usedPasses) || usedPasses < 0) {
    return Response.json({ error: "Datos de confirmación inválidos." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .select("passes_number")
    .eq("invitation_token", token)
    .maybeSingle();

  if (guestError || !guest) return Response.json({ error: "Invitación no encontrada." }, { status: 404 });
  if ((confirmation === "declined" && usedPasses !== 0) || (confirmation === "confirmed" && (usedPasses < 1 || usedPasses > guest.passes_number))) {
    return Response.json({ error: "La cantidad de pases no es válida para esta invitación." }, { status: 400 });
  }

  const { error } = await supabase
    .from("guests")
    .update({
      confirmation,
      used_passes_confirmed: usedPasses,
      guest_observation: typeof body.guest_observation === "string" ? body.guest_observation.trim() || null : null,
      updated_at: new Date().toISOString(),
    })
    .eq("invitation_token", token);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}