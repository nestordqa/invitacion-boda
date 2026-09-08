create or replace function public.validate_guest_member_table_capacity()
returns trigger
language plpgsql
as $$
declare
  occupied_seats integer;
begin
  if new.table_id is null then
    return new;
  end if;

  select coalesce(sum(
    case
      when lower(trim(gm.name)) = lower(trim(g.name)) then greatest((case when g.confirmation = 'confirmed' then g.used_passes_confirmed else g.passes_number end) - (
        select count(*)
        from public.guest_members individual
        where individual.guest_id = gm.guest_id
          and lower(trim(individual.name)) <> lower(trim(g.name))
      ), 0)
      else 1
    end
  ), 0)::integer
    into occupied_seats
    from public.guest_members gm
    join public.guests g on g.id = gm.guest_id
   where gm.table_id = new.table_id
     and gm.id <> new.id;

  select occupied_seats + case
    when lower(trim(new.name)) = lower(trim(g.name)) then greatest((case when g.confirmation = 'confirmed' then g.used_passes_confirmed else g.passes_number end) - (
      select count(*)
      from public.guest_members individual
      where individual.guest_id = new.guest_id
        and individual.id <> new.id
        and lower(trim(individual.name)) <> lower(trim(g.name))
    ), 0)
    else 1
  end
    into occupied_seats
    from public.guests g
   where g.id = new.guest_id;

  if occupied_seats > 10 then
    raise exception 'No hay suficientes puestos en esta mesa';
  end if;

  return new;
end;
$$;