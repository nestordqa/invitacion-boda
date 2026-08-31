import { EventDetails } from "@/components/EventDetails";
import { EnvelopeCover } from "@/components/EnvelopeCover";
import { Hero } from "@/components/Hero";
import { Itinerary } from "@/components/Itinerary";
import { PhotoAlbum } from "@/components/PhotoAlbum";
import { RsvpForm } from "@/components/RsvpForm";
import { Story } from "@/components/Story";
import { WeddingInfo } from "@/components/WeddingInfo";

export default function Home() {
  return (
    <EnvelopeCover>
      <main>
        <Hero />
        <Story />
        <EventDetails />
        <Itinerary />
        <WeddingInfo />
        <PhotoAlbum />
        <RsvpForm />
      </main>
    </EnvelopeCover>
  );
}
