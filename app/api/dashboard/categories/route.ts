import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.from("categories").select("id, name, description").order("name");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ categories: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return Response.json({ error: "Ingresa el nombre de la categoría." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.from("categories").insert({ name, description: typeof body.description === "string" ? body.description.trim() || null : null }).select("id, name, description").single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ category: data }, { status: 201 });
}