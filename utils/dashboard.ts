import { createClient } from "@/utils/supabase/server";
import { getWedding } from "@/utils/wedding";
import { cookies } from "next/headers";

// Devuelve el cliente de Supabase y la boda del usuario autenticado.
// Las políticas RLS ya limitan cada consulta a esa boda.
export async function getDashboardContext() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("weddings").select("id, slug").maybeSingle();
  const wedding = getWedding(data?.slug);
  if (!data || !wedding) return null;

  return { supabase, weddingId: data.id as string, wedding };
}

export const unauthorized = () => Response.json({ error: "Inicia sesión para continuar." }, { status: 401 });
