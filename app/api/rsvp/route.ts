import { getInvitation } from "@/utils/invitation";
import { createClient } from "@/utils/supabase/server";
import { getWedding, isWeddingRsvpOpen } from "@/utils/wedding";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const confirmations = ["confirmed", "declined"] as const;

export async function GET(request: NextRequest) {
  const invitation = await getInvitation(request.nextUrl.searchParams.get("token"));
  if (!invitation) return Response.json({ error: "Invitación no encontrada." }, { status: 404 });
  return Response.json({ guest: invitation });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const token = typeof body.token === "string" ? body.token : "";
  const confirmation = body.confirmation;
  const usedPasses = Number(body.used_passes_confirmed);

  if (!token || !confirmations.includes(confirmation) || !Number.isInteger(usedPasses) || usedPasses < 0) {
    return Response.json({ error: "Datos de confirmación inválidos." }, { status: 400 });
  }

  const invitation = await getInvitation(token);
  const wedding = getWedding(invitation?.wedding_slug);
  if (!invitation || !wedding) return Response.json({ error: "Invitación no encontrada." }, { status: 404 });
  if (!isWeddingRsvpOpen(wedding)) return Response.json({ error: "El plazo para confirmar ya finalizó." }, { status: 403 });
  if ((confirmation === "declined" && usedPasses !== 0) || (confirmation === "confirmed" && (usedPasses < 1 || usedPasses > invitation.passes_number))) {
    return Response.json({ error: "La cantidad de pases no es válida para esta invitación." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.rpc("submit_rsvp", {
    p_token: token,
    p_confirmation: confirmation,
    p_used_passes: usedPasses,
    p_observation: typeof body.guest_observation === "string" ? body.guest_observation : "",
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}
