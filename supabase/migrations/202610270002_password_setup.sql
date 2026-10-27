-- Permite comprobar, antes de enviar un enlace de acceso, que el correo
-- pertenece a un administrador de alguna boda.
create or replace function public.is_wedding_admin(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.wedding_admins where email = lower(trim(p_email)));
$$;

revoke all on function public.is_wedding_admin from public;
grant execute on function public.is_wedding_admin to anon, authenticated;
