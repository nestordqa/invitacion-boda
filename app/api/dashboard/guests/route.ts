import { createClient } from "@/utils/supabase/server";
import { formatGuestName } from "@/utils/wedding";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const PAGE_SIZES = [5, 10, 20, 50];

function applyFilters<T extends { eq: (column: string, value: string | boolean) => T; or: (filters: string) => T; ilike: (column: string, value: string) => T }>(query: T, filters: { relationships: string[]; status: string | null; sent: string | null; search: string }) {
  if (filters.relationships.length) {
    query = query.or(filters.relationships.map((relationship) => `${relationship}.eq.true`).join(","));
  }
  if (filters.status) query = query.eq("confirmation", filters.status);
  if (filters.sent) query = query.eq("invitation_sent", filters.sent === "true");
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);
  return query;
}

export async function GET(request: NextRequest) {
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const requestedPageSize = Number(request.nextUrl.searchParams.get("pageSize"));
  const pageSize = PAGE_SIZES.includes(requestedPageSize) ? requestedPageSize : 20;
  const relationships = request.nextUrl.searchParams.getAll("relationship").filter((value) => ["groom_family", "bride_family", "friend"].includes(value));
  const status = request.nextUrl.searchParams.get("status");
  const sent = request.nextUrl.searchParams.get("sent");
  const search = request.nextUrl.searchParams.get("search")?.trim() ?? "";
  const supabase = createClient(await cookies());
  const start = (page - 1) * pageSize;

  const guestsQuery = supabase
    .from("guests")
    .select("id, family, name, groom_family, bride_family, friend, confirmation, passes_number, used_passes_confirmed, guest_observation, internal_observation, invitation_token, invitation_url, invitation_sent, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(start, start + pageSize - 1);
  const { data, error, count } = await applyFilters(guestsQuery, { relationships, status, sent, search });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const summaryQuery = supabase
    .from("guests")
    .select("groom_family, bride_family, friend, confirmation, passes_number, used_passes_confirmed");
  const { data: summaryRows, error: summaryError } = await applyFilters(summaryQuery, { relationships, status, sent, search });

  if (summaryError) {
    return Response.json({ error: summaryError.message }, { status: 500 });
  }

  const summary = (summaryRows ?? []).reduce((totals, guest) => {
    const confirmedPasses = guest.confirmation === "confirmed" ? guest.used_passes_confirmed : 0;
    totals.totalPasses += guest.passes_number;
    if (guest.groom_family) totals.groomFamilyPasses += guest.passes_number;
    if (guest.bride_family) totals.brideFamilyPasses += guest.passes_number;
    if (guest.friend) totals.friendPasses += guest.passes_number;
    if (guest.confirmation === "confirmed") totals.confirmedPasses += confirmedPasses;
    if (guest.confirmation === "pending") totals.pendingPasses += guest.passes_number;
    if (guest.confirmation === "declined") totals.declinedPasses += guest.passes_number;
    return totals;
  }, { totalPasses: 0, groomFamilyPasses: 0, brideFamilyPasses: 0, friendPasses: 0, confirmedPasses: 0, pendingPasses: 0, declinedPasses: 0 });

  return Response.json({ guests: data, page, pageSize, total: count ?? 0, summary });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = typeof body.name === "string" ? formatGuestName(body.name) : "";
  const passesNumber = Number(body.passes_number);

  if (!name || !Number.isInteger(passesNumber) || passesNumber < 1) {
    return Response.json({ error: "Ingresa un nombre y una cantidad válida de pases." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const { data: existingGuest, error: duplicateCheckError } = await supabase
    .from("guests")
    .select("id")
    .ilike("name", name)
    .limit(1)
    .maybeSingle();

  if (duplicateCheckError) {
    return Response.json({ error: duplicateCheckError.message }, { status: 500 });
  }

  if (existingGuest) {
    return Response.json({ error: "Ya existe un invitado con ese nombre." }, { status: 409 });
  }

  const invitationToken = crypto.randomUUID();
  const invitationUrl = new URL(`/v2?token=${invitationToken}`, request.url).toString();
  const { data, error } = await supabase
    .from("guests")
    .insert({
      family: Boolean(body.family),
      name,
      groom_family: Boolean(body.groom_family),
      bride_family: Boolean(body.bride_family),
      friend: Boolean(body.friend),
      confirmation: "pending",
      passes_number: passesNumber,
      used_passes_confirmed: 0,
      internal_observation: typeof body.internal_observation === "string" ? body.internal_observation.trim() || null : null,
      invitation_token: invitationToken,
      invitation_url: invitationUrl,
      invitation_sent: false,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ guest: data }, { status: 201 });
}