import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, context: RouteContext<"/api/dashboard/tables/[id]">) {
  const tableId = Number((await context.params).id);
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!Number.isInteger(tableId) || !name) return Response.json({ error: "Verifica el nombre de la mesa." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.from("wedding_tables").update({ name }).eq("id", tableId).select("id, name, created_at").single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ table: data });
}

export async function DELETE(_request: NextRequest, context: RouteContext<"/api/dashboard/tables/[id]">) {
  const tableId = Number((await context.params).id);
  if (!Number.isInteger(tableId)) return Response.json({ error: "Mesa inválida." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { error: membersError } = await supabase.from("guest_members").update({ table_id: null }).eq("table_id", tableId);
  if (membersError) return Response.json({ error: membersError.message }, { status: 500 });

  const { error: legacyGuestsError } = await supabase.from("guests").update({ table_id: null }).eq("table_id", tableId);
  if (legacyGuestsError) return Response.json({ error: legacyGuestsError.message }, { status: 500 });

  const { error } = await supabase.from("wedding_tables").delete().eq("id", tableId);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}