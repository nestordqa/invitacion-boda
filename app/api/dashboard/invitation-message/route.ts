import { getDashboardContext, unauthorized } from "@/utils/dashboard";
import { NextRequest } from "next/server";

export async function GET() {
  const dashboard = await getDashboardContext();
  if (!dashboard) return unauthorized();
  const { supabase } = dashboard;
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

  const dashboard = await getDashboardContext();
  if (!dashboard) return unauthorized();
  const { supabase, weddingId } = dashboard;
  const { data, error } = await supabase
    .from("invitation_message_templates")
    .upsert({ wedding_id: weddingId, template_type: templateType, content, updated_at: new Date().toISOString() }, { onConflict: "wedding_id,template_type" })
    .select("template_type, content, updated_at")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ template: data });
}
