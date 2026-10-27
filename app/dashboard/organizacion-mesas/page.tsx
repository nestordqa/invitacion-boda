import { getDashboardContext } from "@/utils/dashboard";
import { NoWeddingAccess } from "../NoWeddingAccess";
import { TablesDashboard } from "./TablesDashboard";

export const metadata = {
  title: "Dashboard | Organización de mesas",
};

export default async function TablesPage() {
  const dashboard = await getDashboardContext();
  if (!dashboard) return <NoWeddingAccess />;
  return <TablesDashboard coupleNames={dashboard.wedding.coupleNames} />;
}
