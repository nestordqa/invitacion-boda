import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers'
import { InvitationV2 } from "@/components/v2/InvitationV2";

type HomeProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function HomeV2({ searchParams }: HomeProps) {
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

  return <InvitationV2 guest={guest} token={token} />;
}
