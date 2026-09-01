import { EventDetails } from "./EventDetails";
import { IntroGate } from "./IntroGate";
import { Itinerary } from "./Itinerary";
import { PhotoAlbum } from "./PhotoAlbum";
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
      <Story />
      <EventDetails />
      <Itinerary />
      <WeddingInfo />
      <PhotoAlbum />
      <RsvpForm guest={guest} token={token} />
    </main>
  );
}
