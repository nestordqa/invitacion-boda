import { getDashboardContext } from "@/utils/dashboard";
import { NoWeddingAccess } from "../NoWeddingAccess";
import { BudgetDashboard } from "./BudgetDashboard";

export const metadata = { title: "Dashboard | Compras y pagos" };

export default async function BudgetPage() {
  const dashboard = await getDashboardContext();
  if (!dashboard) return <NoWeddingAccess />;
  return <BudgetDashboard coupleNames={dashboard.wedding.coupleNames} />;
}
