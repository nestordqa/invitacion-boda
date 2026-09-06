import { Blessing } from "./Blessing";
import { EventDetails } from "./EventDetails";
import { IntroGate } from "./IntroGate";
import { Itinerary } from "./Itinerary";
import { PhotoAlbum } from "./PhotoAlbum";
import { PhotoBreak } from "./PhotoBreak";
import { RsvpForm } from "./RsvpForm";
import { Story } from "./Story";
import { WeddingInfo } from "./WeddingInfo";

type InvitationV2Props = {
  guest: {
    name: string;
    family: boolean;
    passes_number: number;
    confirmation: "pending" | "confirmed" | "declined";
    used_passes_confirmed: number;
    guest_observation: string | null;
  } | null;
  token?: string;
};

export function InvitationV2({ guest, token }: InvitationV2Props) {
  return (
    <main className="bg-[#FDFBF7]">
      <IntroGate guest={guest} />
      {/* <Story /> */}
      <EventDetails />
      <Blessing />
      <WeddingInfo />
      <Itinerary />
      <PhotoBreak src="/v2/photos/backgrounds/3.jpeg" alt="Detalle de la celebración de boda" />
      <PhotoAlbum />
      <RsvpForm guest={guest} token={token} />
    </main>
  );
}
