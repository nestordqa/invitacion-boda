import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, context: RouteContext<"/api/dashboard/guests/[id]/invitation-sent">) {
  const { id } = await context.params;
  const guestId = Number(id);
  const body = await request.json();

  if (!Number.isInteger(guestId) || typeof body.invitation_sent !== "boolean") {
    return Response.json({ error: "Estado de envío inválido." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase
    .from("guests")
    .update({ invitation_sent: body.invitation_sent, updated_at: new Date().toISOString() })
    .eq("id", guestId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}