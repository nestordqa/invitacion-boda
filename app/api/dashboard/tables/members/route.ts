import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const guestId = Number(body.guest_id);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!Number.isInteger(guestId) || !name) return Response.json({ error: "Selecciona una invitación e ingresa el nombre." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data: guest, error: guestError } = await supabase.from("guests").select("id, passes_number, confirmation, unlikely_to_attend").eq("id", guestId).single();
  if (guestError || !guest) return Response.json({ error: "La invitación no existe." }, { status: 404 });
  if (guest.confirmation === "declined" || (guest.confirmation === "pending" && guest.unlikely_to_attend)) return Response.json({ error: "Esta invitación no está considerada para asistir." }, { status: 409 });

  const { data, error } = await supabase.from("guest_members").insert({ guest_id: guestId, name }).select("id, guest_id, name, table_id").single();
  if (error) {
    const message = error.message.includes("todos sus pases") ? "Esta invitación ya tiene registrados todos sus pases" : error.message;
    return Response.json({ error: message }, { status: message === "Esta invitación ya tiene registrados todos sus pases" ? 409 : 500 });
  }
  return Response.json({ member: data }, { status: 201 });
}