export const RSVP_DEADLINE = new Date("2026-09-30T23:59:59-04:00");

export const RSVP_DEADLINE_LABEL = new Intl.DateTimeFormat("es-DO", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(RSVP_DEADLINE);

export const isRsvpOpen = () => new Date() <= RSVP_DEADLINE;