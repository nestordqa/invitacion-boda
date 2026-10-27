export type WeddingSlug = "nestor-valentina" | "gabriel-vanessa";

export type WeddingConfig = {
  slug: WeddingSlug;
  coupleNames: string;
  invitationPath: string;
  rsvpDeadline: Date;
  maxConfirmedGuests: number;
};

export const WEDDINGS: Record<WeddingSlug, WeddingConfig> = {
  "nestor-valentina": {
    slug: "nestor-valentina",
    coupleNames: "Néstor & Valentina",
    invitationPath: "/v2",
    rsvpDeadline: new Date("2026-10-15T23:59:59-04:00"),
    maxConfirmedGuests: 130,
  },
  "gabriel-vanessa": {
    slug: "gabriel-vanessa",
    coupleNames: "Gabriel & Vanessa",
    invitationPath: "/v3",
    rsvpDeadline: new Date("2027-01-15T23:59:59+01:00"),
    maxConfirmedGuests: 90,
  },
};

export const getWedding = (slug: string | null | undefined) =>
  slug && slug in WEDDINGS ? WEDDINGS[slug as WeddingSlug] : null;

export const formatRsvpDeadline = (wedding: WeddingConfig) =>
  new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(wedding.rsvpDeadline);

export const isWeddingRsvpOpen = (wedding: WeddingConfig) => new Date() <= wedding.rsvpDeadline;

// Valores usados por la invitación V1/V2 de Néstor & Valentina.
export const RSVP_DEADLINE = WEDDINGS["nestor-valentina"].rsvpDeadline;

export const MAX_CONFIRMED_GUESTS = WEDDINGS["nestor-valentina"].maxConfirmedGuests;

export const RSVP_DEADLINE_LABEL = new Intl.DateTimeFormat("es-DO", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(RSVP_DEADLINE);

export const isRsvpOpen = () => new Date() <= RSVP_DEADLINE;

export function formatGuestName(value: string) {
  return value
    .replace(/(^|\s)(\p{L})/gu, (_match, whitespace: string, letter: string) => (
      `${whitespace}${letter.toLocaleUpperCase("es")}`
    ));
}
