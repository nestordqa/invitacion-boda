-- Nueva categoría de invitado: compañero de trabajo.
alter table public.guests add column if not exists coworker boolean not null default false;
