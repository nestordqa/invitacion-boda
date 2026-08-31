alter table public.budget_items
  add column if not exists paid_in_bolivars boolean not null default false;