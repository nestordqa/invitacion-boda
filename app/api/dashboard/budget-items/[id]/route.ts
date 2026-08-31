import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, context: RouteContext<"/api/dashboard/budget-items/[id]">) {
  const { id } = await context.params;
  const itemId = Number(id);
  const body = await request.json();
  const item = typeof body.item === "string" ? body.item.trim() : "";
  const quantity = Number(body.quantity);
  const amountPerUnit = Number(body.amount_per_unit);
  const amountPaid = Number(body.amount_paid);
  const categoryId = Number(body.category_id);
  if (!Number.isInteger(itemId) || !item || !Number.isInteger(quantity) || quantity <= 0 || !Number.isFinite(amountPerUnit) || amountPerUnit < 0 || !Number.isFinite(amountPaid) || amountPaid < 0 || amountPaid > quantity * amountPerUnit || !Number.isInteger(categoryId)) return Response.json({ error: "Verifica artículo, categoría, cantidades y montos." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.from("budget_items").update({ item, description: typeof body.description === "string" ? body.description.trim() || null : null, bought: Boolean(body.bought), quantity, amount_per_unit: amountPerUnit, amount_paid: amountPaid, paid_in_bolivars: Boolean(body.paid_in_bolivars), category_id: categoryId, supplier: typeof body.supplier === "string" ? body.supplier.trim() || null : null, updated_at: new Date().toISOString() }).eq("id", itemId).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ item: data });
}

export async function DELETE(_request: NextRequest, context: RouteContext<"/api/dashboard/budget-items/[id]">) {
  const { id } = await context.params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) return Response.json({ error: "Compra inválida." }, { status: 400 });
  const supabase = createClient(await cookies());
  const { error } = await supabase.from("budget_items").delete().eq("id", itemId);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}