import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export type Invitation = {
  name: string;
  family: boolean;
  passes_number: number;
  confirmation: "pending" | "confirmed" | "declined";
  used_passes_confirmed: number;
  guest_observation: string | null;
  wedding_slug: string;
};

// Lee una invitación por su token mediante la función pública get_invitation,
// sin exponer el resto de la tabla de invitados.
export async function getInvitation(token: string | undefined | null) {
  if (!token) return null;
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.rpc("get_invitation", { p_token: token });
  if (error || !data) return null;
  return data as Invitation;
}

// Variante que solo acepta invitaciones de una boda concreta.
export async function getWeddingInvitation(token: string | undefined, weddingSlug: string) {
  const invitation = await getInvitation(token);
  return invitation?.wedding_slug === weddingSlug ? invitation : null;
}
