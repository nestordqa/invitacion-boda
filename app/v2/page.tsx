import { getWeddingInvitation } from "@/utils/invitation";
import { InvitationV2 } from "@/components/v2/InvitationV2";

type HomeProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function HomeV2({ searchParams }: HomeProps) {
  const { token } = await searchParams;
  const guest = await getWeddingInvitation(token, "nestor-valentina");

  return <InvitationV2 guest={guest} token={token} />;
}
