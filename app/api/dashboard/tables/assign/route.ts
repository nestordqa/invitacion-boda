import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const guestId = Number(body.guest_id);
  const tableId = body.table_id === null || body.table_id === "" ? null : Number(body.table_id);
  if (!Number.isInteger(guestId) || (tableId !== null && !Number.isInteger(tableId))) return Response.json({ error: "Invitado o mesa inválida." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.from("guests").update({ table_id: tableId, updated_at: new Date().toISOString() }).eq("id", guestId).select("id, table_id").single();
  if (error) {
    const message = error.message.includes("No hay suficientes puestos") ? "No hay suficientes puestos en esta mesa" : error.message;
    return Response.json({ error: message }, { status: message === "No hay suficientes puestos en esta mesa" ? 409 : 500 });
  }
  return Response.json({ guest: data });
}