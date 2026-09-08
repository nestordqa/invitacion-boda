import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, context: RouteContext<"/api/dashboard/tables/members/[id]">) {
  const memberId = Number((await context.params).id);
  const body = await request.json();
  const tableId = body.table_id === null || body.table_id === "" ? null : Number(body.table_id);
  if (!Number.isInteger(memberId) || (tableId !== null && !Number.isInteger(tableId))) return Response.json({ error: "Persona o mesa inválida." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.from("guest_members").update({ table_id: tableId }).eq("id", memberId).select("id, guest_id, name, table_id").single();
  if (error) {
    const message = error.message.includes("No hay suficientes puestos") ? "No hay suficientes puestos en esta mesa" : error.message;
    return Response.json({ error: message }, { status: message === "No hay suficientes puestos en esta mesa" ? 409 : 500 });
  }
  return Response.json({ member: data });
}

export async function DELETE(_request: NextRequest, context: RouteContext<"/api/dashboard/tables/members/[id]">) {
  const memberId = Number((await context.params).id);
  if (!Number.isInteger(memberId)) return Response.json({ error: "Persona inválida." }, { status: 400 });
  const supabase = createClient(await cookies());
  const { error } = await supabase.from("guest_members").delete().eq("id", memberId);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}