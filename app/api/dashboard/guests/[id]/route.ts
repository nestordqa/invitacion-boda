import { createClient } from "@/utils/supabase/server";
import { formatGuestName } from "@/utils/wedding";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const confirmations = ["pending", "confirmed", "declined"] as const;

export async function PATCH(request: NextRequest, context: RouteContext<"/api/dashboard/guests/[id]">) {
  const { id } = await context.params;
  const guestId = Number(id);
  const body = await request.json();
  const name = typeof body.name === "string" ? formatGuestName(body.name) : "";
  const passesNumber = Number(body.passes_number);
  const usedPasses = Number(body.used_passes_confirmed);

  if (!Number.isInteger(guestId) || !name || !Number.isInteger(passesNumber) || passesNumber < 1 || !Number.isInteger(usedPasses) || usedPasses < 0 || usedPasses > passesNumber || !confirmations.includes(body.confirmation)) {
    return Response.json({ error: "Verifica el nombre, estado y cantidad de pases." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("guests")
    .update({
      family: Boolean(body.family),
      name,
      groom_family: Boolean(body.groom_family),
      bride_family: Boolean(body.bride_family),
      friend: Boolean(body.friend),
      confirmation: body.confirmation,
      passes_number: passesNumber,
      used_passes_confirmed: usedPasses,
      internal_observation: typeof body.internal_observation === "string" ? body.internal_observation.trim() || null : null,
      invitation_sent: Boolean(body.invitation_sent),
      updated_at: new Date().toISOString(),
    })
    .eq("id", guestId)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ guest: data });
}

export async function DELETE(_request: NextRequest, context: RouteContext<"/api/dashboard/guests/[id]">) {
  const { id } = await context.params;
  const guestId = Number(id);
  if (!Number.isInteger(guestId)) return Response.json({ error: "Invitado inválido." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { error } = await supabase.from("guests").delete().eq("id", guestId);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}