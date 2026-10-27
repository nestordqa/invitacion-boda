import { getDashboardContext } from "@/utils/dashboard";
import { GuestsDashboard } from "./GuestsDashboard";
import { NoWeddingAccess } from "./NoWeddingAccess";

export const metadata = {
  title: "Dashboard | Invitados",
};

export default async function DashboardPage() {
  const dashboard = await getDashboardContext();
  if (!dashboard) return <NoWeddingAccess />;
  return <GuestsDashboard coupleNames={dashboard.wedding.coupleNames} maxConfirmedGuests={dashboard.wedding.maxConfirmedGuests} />;
}
