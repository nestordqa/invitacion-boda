import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const guestFields = "id, name, passes_number, used_passes_confirmed, confirmation, groom_family, bride_family, friend, unlikely_to_attend";

function canBeAssigned(guest: { confirmation: string; unlikely_to_attend: boolean }) {
  return guest.confirmation !== "declined" && !(guest.confirmation === "pending" && guest.unlikely_to_attend);
}

export async function GET() {
  const supabase = createClient(await cookies());
  const [{ data: tables, error: tablesError }, { data: guests, error: guestsError }, { data: members, error: membersError }] = await Promise.all([
    supabase.from("wedding_tables").select("id, name, created_at").order("created_at", { ascending: true }),
    supabase.from("guests").select(guestFields).order("name", { ascending: true }),
    supabase.from("guest_members").select("id, guest_id, name, table_id").order("name", { ascending: true }),
  ]);

  if (tablesError || guestsError || membersError) return Response.json({ error: (tablesError || guestsError || membersError)?.message }, { status: 500 });
  const eligibleGuests = (guests || []).filter(canBeAssigned);
  const missingPrimaryMembers = eligibleGuests
    .filter((guest) => !(members || []).some((member) => member.guest_id === guest.id && member.name.trim().toLocaleLowerCase() === guest.name.trim().toLocaleLowerCase()))
    .map((guest) => ({ guest_id: guest.id, name: guest.name }));
  let allMembers = members || [];
  if (missingPrimaryMembers.length) {
    const { data: createdMembers, error: createMembersError } = await supabase
      .from("guest_members")
      .insert(missingPrimaryMembers)
      .select("id, guest_id, name, table_id");
    if (createMembersError) return Response.json({ error: createMembersError.message }, { status: 500 });
    allMembers = [...allMembers, ...(createdMembers || [])];
  }
  const membersWithGuest = allMembers.map((member) => ({ ...member, guest: (guests || []).find((guest) => guest.id === member.guest_id) || null }));
  return Response.json({
    tables: (tables || []).map((table) => ({ ...table, members: membersWithGuest.filter((member) => member.table_id === table.id) })),
    unassigned: membersWithGuest.filter((member) => member.table_id === null && member.guest && canBeAssigned(member.guest)),
    invitations: eligibleGuests.map((guest) => ({ ...guest, registeredMembers: allMembers.filter((member) => member.guest_id === guest.id).length })),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return Response.json({ error: "Ingresa un nombre para la mesa." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.from("wedding_tables").insert({ name }).select("id, name, created_at").single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ table: { ...data, members: [] } }, { status: 201 });
}