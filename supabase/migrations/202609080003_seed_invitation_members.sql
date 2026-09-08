alter table public.guest_members
  add column if not exists is_primary boolean not null default false;

insert into public.guest_members (guest_id, name, is_primary)
select g.id, g.name, true
from public.guests g
where g.confirmation <> 'declined'
  and not (g.confirmation = 'pending' and g.unlikely_to_attend)
  and not exists (
    select 1
    from public.guest_members gm
    where gm.guest_id = g.id
  );

update public.guest_members gm
set is_primary = true
from public.guests g
where gm.guest_id = g.id
  and gm.name = g.name
  and not exists (
    select 1
    from public.guest_members other
    where other.guest_id = gm.guest_id
      and other.id < gm.id
  );

create or replace function public.ensure_guest_member_for_invitation()
returns trigger
language plpgsql
as $$
begin
  if new.confirmation <> 'declined'
     and not (new.confirmation = 'pending' and new.unlikely_to_attend)
     and not exists (
       select 1
       from public.guest_members
       where guest_id = new.id
     ) then
    insert into public.guest_members (guest_id, name, is_primary)
    values (new.id, new.name, true);
  end if;

  return new;
end;
$$;

drop trigger if exists ensure_guest_member_trigger on public.guests;

create trigger ensure_guest_member_trigger
after insert or update of confirmation, unlikely_to_attend on public.guests
for each row execute function public.ensure_guest_member_for_invitation();
