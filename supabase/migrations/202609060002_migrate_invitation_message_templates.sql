alter table public.guests
  add column if not exists is_abroad boolean not null default false;

alter table public.invitation_message_templates
  add column if not exists template_type text;

update public.invitation_message_templates
set template_type = 'standard'
where template_type is null;

alter table public.invitation_message_templates
  alter column template_type set not null;

alter table public.invitation_message_templates
  drop constraint if exists invitation_message_templates_id_check;

create unique index if not exists invitation_message_templates_template_type_idx
  on public.invitation_message_templates (template_type);

insert into public.invitation_message_templates (id, template_type, content)
values (
  2,
  'abroad',
  'Mensaje para familiares y amigos en el extranjero

Hay momentos en la vida que son inolvidables, pero compartirlos con quienes amamos los hace eternos.❤️✨

Aunque la distancia nos separe en este día, sus nombres y su cariño siempre están presentes en nuestra historia. Nos haría muy felices que nos acompañen de corazón y a la distancia a unir nuestras vidas en matrimonio. 💒💍

🗓️ Fecha: 29 de Diciembre de 2026 ⏰ Hora: 5:30 pm (Hora de Venezuela)

🔗 En el siguiente enlace pueden ver nuestra invitación digital con todos los detalles de la boda: {{url}}

Queremos que vivan cada segundo de nuestro gran día con nosotros, sin importar dónde se encuentren.

📸 Álbum de fotos compartido: También hemos creado un álbum digital para recopilar los mejores momentos. Pueden ver las fotos y subir las que ustedes mismos tomen durante el evento aquí: 🔗{{album_url}}

¡Un abrazo enorme, los queremos muchísimo! 🫶🏻 Néstor Quiñones y Valentina Moreno'
)
on conflict (template_type) do nothing;
