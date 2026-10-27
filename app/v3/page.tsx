import type { Metadata } from "next";
import { InvitationV3 } from "@/components/v3/InvitationV3";
import { getWeddingInvitation } from "@/utils/invitation";
import { WEDDINGS, isWeddingRsvpOpen } from "@/utils/wedding";

export const metadata: Metadata = {
  title: "Gabriel & Vanessa · 6 de marzo de 2027",
  description: "Invitación de boda de Gabriel y Vanessa · 6 de marzo de 2027",
};

type HomeProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function HomeV3({ searchParams }: HomeProps) {
  const { token } = await searchParams;
  const wedding = WEDDINGS["gabriel-vanessa"];
  const guest = await getWeddingInvitation(token, wedding.slug);

  return <InvitationV3 guest={guest} token={token} rsvpDeadline={wedding.rsvpDeadline.toISOString()} rsvpOpen={isWeddingRsvpOpen(wedding)} />;
}
