import { getWeddingInvitation } from "@/utils/invitation";
import { EventDetails } from "@/components/EventDetails";
import { EnvelopeCover } from "@/components/EnvelopeCover";
import { Hero } from "@/components/Hero";
import { Itinerary } from "@/components/Itinerary";
import { PhotoAlbum } from "@/components/PhotoAlbum";
import { RsvpForm } from "@/components/RsvpForm";
import { Story } from "@/components/Story";
import { WeddingInfo } from "@/components/WeddingInfo";

type HomeProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { token } = await searchParams;
  const guest = await getWeddingInvitation(token, "nestor-valentina");

  return (
    <EnvelopeCover>
      <main>
        <Hero />
        <Story />
        <EventDetails />
        <Itinerary />
        <WeddingInfo />
        <PhotoAlbum />
        <RsvpForm guest={guest} token={token} />
      </main>
    </EnvelopeCover>
  );
}
