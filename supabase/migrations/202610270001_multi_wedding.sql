-- Soporte para varias bodas en la misma base de datos.
-- Cada fila pertenece a una boda (wedding_id) y la seguridad por fila (RLS)
-- garantiza que cada pareja solo vea y modifique los datos de su boda.

create table if not exists public.weddings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  couple_names text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.wedding_admins (
  email text primary key check (email = lower(email)),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  created_at timestamptz not null default now()
);

insert into public.weddings (slug, couple_names)
values
  ('nestor-valentina', 'Néstor & Valentina'),
  ('gabriel-vanessa', 'Gabriel & Vanessa')
on conflict (slug) do nothing;

insert into public.wedding_admins (email, wedding_id)
select admin.email, w.id
  from (values ('ndqa96@gmail.com'), ('valentinamreinoza@gmail.com')) as admin(email)
  join public.weddings w on w.slug = 'nestor-valentina'
on conflict (email) do nothing;

insert into public.wedding_admins (email, wedding_id)
select admin.email, w.id
  from (values ('gabrieln10@icloud.com'), ('vanessaduranbar@gmail.com')) as admin(email)
  join public.weddings w on w.slug = 'gabriel-vanessa'
on conflict (email) do nothing;

-- Boda del usuario autenticado. Se usa en las políticas RLS y como valor por
-- defecto de wedding_id, así las inserciones del dashboard quedan asociadas
-- automáticamente a la boda correcta.
create or replace function public.current_wedding_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select wedding_id
    from public.wedding_admins
   where email = lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

do $$
declare
  table_name text;
  default_wedding uuid;
  policy record;
begin
  select id into default_wedding from public.weddings where slug = 'nestor-valentina';

  foreach table_name in array array['guests', 'guest_members', 'wedding_tables', 'budget_items', 'categories', 'invitation_message_templates']
  loop
    execute format('alter table public.%I add column if not exists wedding_id uuid references public.weddings(id) on delete cascade', table_name);
    execute format('update public.%I set wedding_id = %L where wedding_id is null', table_name, default_wedding);
    execute format('alter table public.%I alter column wedding_id set not null', table_name);
    execute format('alter table public.%I alter column wedding_id set default public.current_wedding_id()', table_name);
    execute format('create index if not exists %I on public.%I (wedding_id)', table_name || '_wedding_id_idx', table_name);

    -- Elimina cualquier política anterior (por ejemplo, acceso abierto a anon)
    -- para que solo apliquen las políticas por boda.
    for policy in select policyname from pg_policies where schemaname = 'public' and tablename = table_name
    loop
      execute format('drop policy %I on public.%I', policy.policyname, table_name);
    end loop;

    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy %I on public.%I for all to authenticated using (wedding_id = public.current_wedding_id()) with check (wedding_id = public.current_wedding_id())',
      'Wedding admins manage ' || table_name,
      table_name
    );
  end loop;
end $$;

-- Las plantillas de mensaje y las categorías ahora son únicas por boda.
alter table public.invitation_message_templates drop constraint if exists invitation_message_templates_template_type_key;
alter table public.invitation_message_templates drop constraint if exists invitation_message_templates_wedding_template_key;
alter table public.invitation_message_templates
  add constraint invitation_message_templates_wedding_template_key unique (wedding_id, template_type);
alter table public.categories drop constraint if exists categories_name_key;

-- Elimina índices únicos creados a mano sobre una sola columna
-- (template_type o name), sin importar su nombre.
do $$
declare
  unique_index record;
begin
  for unique_index in
    select i.relname as index_name, t.relname as table_name, c.conname as constraint_name
      from pg_index x
      left join pg_constraint c on c.conindid = x.indexrelid
      join pg_class i on i.oid = x.indexrelid
      join pg_class t on t.oid = x.indrelid
      join pg_namespace n on n.oid = t.relnamespace
      join pg_attribute a on a.attrelid = t.oid and a.attnum = x.indkey[0]
     where n.nspname = 'public'
       and x.indisunique
       and not x.indisprimary
       and x.indnatts = 1
       and ((t.relname = 'invitation_message_templates' and a.attname = 'template_type')
         or (t.relname = 'categories' and a.attname = 'name'))
  loop
    if unique_index.constraint_name is not null then
      execute format('alter table public.%I drop constraint %I', unique_index.table_name, unique_index.constraint_name);
    else
      execute format('drop index if exists public.%I', unique_index.index_name);
    end if;
  end loop;
end $$;

-- Los ids 1 y 2 se escribieron a mano desde el dashboard, así que la secuencia
-- no avanzó. Se asignan ids explícitos y luego se sincroniza la secuencia.
insert into public.invitation_message_templates (id, wedding_id, template_type, content)
select (select coalesce(max(id), 0) from public.invitation_message_templates) + row_number() over (), w.id, t.template_type, ''
  from public.weddings w
 cross join (values ('standard'), ('abroad')) as t(template_type)
 where w.slug = 'gabriel-vanessa'
   and not exists (
     select 1 from public.invitation_message_templates m
      where m.wedding_id = w.id and m.template_type = t.template_type
   );

do $$
declare
  sequence_name text;
begin
  sequence_name := coalesce(
    pg_get_serial_sequence('public.invitation_message_templates', 'id'),
    substring(
      (select column_default from information_schema.columns
        where table_schema = 'public' and table_name = 'invitation_message_templates' and column_name = 'id')
      from 'nextval\(''([^'']+)'''
    )
  );

  if sequence_name is not null then
    perform setval(sequence_name, (select coalesce(max(id), 1) from public.invitation_message_templates));
  end if;
end $$;

alter table public.weddings enable row level security;
alter table public.wedding_admins enable row level security;
drop policy if exists "Wedding admins read their wedding" on public.weddings;
create policy "Wedding admins read their wedding" on public.weddings
  for select to authenticated using (id = public.current_wedding_id());

-- Impide relacionar mesas o invitados de bodas distintas.
create or replace function public.ensure_same_wedding()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.table_id is not null
     and not exists (select 1 from public.wedding_tables t where t.id = new.table_id and t.wedding_id = new.wedding_id) then
    raise exception 'La mesa no pertenece a esta boda';
  end if;

  -- Comprobación separada: en la tabla guests no existe new.guest_id.
  if tg_table_name = 'guest_members' then
    if not exists (select 1 from public.guests g where g.id = (to_jsonb(new) ->> 'guest_id')::bigint and g.wedding_id = new.wedding_id) then
      raise exception 'La invitación no pertenece a esta boda';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists guests_same_wedding_trigger on public.guests;
create trigger guests_same_wedding_trigger
before insert or update of table_id, wedding_id on public.guests
for each row execute function public.ensure_same_wedding();

drop trigger if exists guest_members_same_wedding_trigger on public.guest_members;
create trigger guest_members_same_wedding_trigger
before insert or update of table_id, guest_id, wedding_id on public.guest_members
for each row execute function public.ensure_same_wedding();

-- Acceso público a una invitación únicamente mediante su token.
create or replace function public.get_invitation(p_token text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'name', g.name,
    'family', g.family,
    'passes_number', g.passes_number,
    'confirmation', g.confirmation,
    'used_passes_confirmed', g.used_passes_confirmed,
    'guest_observation', g.guest_observation,
    'wedding_slug', w.slug
  )
    from public.guests g
    join public.weddings w on w.id = g.wedding_id
   where g.invitation_token::text = p_token;
$$;

create or replace function public.submit_rsvp(
  p_token text,
  p_confirmation public.guests.confirmation%type,
  p_used_passes integer,
  p_observation text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed_passes integer;
begin
  select passes_number into allowed_passes from public.guests where invitation_token::text = p_token;
  if allowed_passes is null then
    return false;
  end if;

  if not (
    (p_confirmation::text = 'declined' and p_used_passes = 0)
    or (p_confirmation::text = 'confirmed' and p_used_passes between 1 and allowed_passes)
  ) then
    raise exception 'La cantidad de pases no es válida para esta invitación.';
  end if;

  update public.guests
     set confirmation = p_confirmation,
         used_passes_confirmed = p_used_passes,
         guest_observation = nullif(trim(p_observation), ''),
         updated_at = now()
   where invitation_token::text = p_token;

  return true;
end;
$$;

revoke all on function public.get_invitation from public;
revoke all on function public.submit_rsvp from public;
grant execute on function public.get_invitation to anon, authenticated;
grant execute on function public.submit_rsvp to anon, authenticated;
