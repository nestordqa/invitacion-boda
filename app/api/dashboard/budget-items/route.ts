import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.from("budget_items").select("id, item, description, bought, quantity, amount_per_unit, total_amount, amount_paid, remaining_balance, paid_in_bolivars, supplier, category_id, categories ( name )").order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ items: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const item = typeof body.item === "string" ? body.item.trim() : "";
  const quantity = Number(body.quantity);
  const amountPerUnit = Number(body.amount_per_unit);
  const amountPaid = Number(body.amount_paid);
  const categoryId = Number(body.category_id);
  if (!item || !Number.isInteger(quantity) || quantity <= 0 || !Number.isFinite(amountPerUnit) || amountPerUnit < 0 || !Number.isFinite(amountPaid) || amountPaid < 0 || amountPaid > quantity * amountPerUnit || !Number.isInteger(categoryId)) return Response.json({ error: "Verifica artículo, categoría, cantidades y montos." }, { status: 400 });

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.from("budget_items").insert({ item, description: typeof body.description === "string" ? body.description.trim() || null : null, bought: Boolean(body.bought), quantity, amount_per_unit: amountPerUnit, amount_paid: amountPaid, paid_in_bolivars: Boolean(body.paid_in_bolivars), category_id: categoryId, supplier: typeof body.supplier === "string" ? body.supplier.trim() || null : null }).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ item: data }, { status: 201 });
}