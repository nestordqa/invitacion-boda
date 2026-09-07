import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("invitation_message_templates")
    .select("template_type, content, updated_at")
    .order("template_type");

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ templates: data });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const templateType = body.template_type === "abroad" ? "abroad" : body.template_type === "standard" ? "standard" : "";

  if (!content || !templateType) {
    return Response.json({ error: "Ingresa un mensaje y selecciona una plantilla válida." }, { status: 400 });
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("invitation_message_templates")
    .upsert({ id: templateType === "standard" ? 1 : 2, template_type: templateType, content, updated_at: new Date().toISOString() }, { onConflict: "template_type" })
    .select("template_type, content, updated_at")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ template: data });
}
