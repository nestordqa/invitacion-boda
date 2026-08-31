import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers'
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
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: guest } = token
    ? await supabase
      .from("guests")
      .select("name, family, passes_number, confirmation, used_passes_confirmed, guest_observation")
      .eq("invitation_token", token)
      .maybeSingle()
    : { data: null };

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
