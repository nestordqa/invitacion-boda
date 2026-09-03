import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, context: RouteContext<"/api/dashboard/guests/[id]/unlikely-to-attend">) {
  const { id } = await context.params;
  const guestId = Number(id);
  const body = await request.json();

  if (!Number.isInteger(guestId) || typeof body.unlikely_to_attend !== "boolean") {
    return Response.json({ error: "Invitado o estado inválido." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("guests")
    .update({ unlikely_to_attend: body.unlikely_to_attend, updated_at: new Date().toISOString() })
    .eq("id", guestId)
    .select("id, unlikely_to_attend")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ guest: data });
}
