import Link from "next/link";

type DashboardNavProps = { active: "guests" | "budget" };

export function DashboardNav({ active }: DashboardNavProps) {
  const items = [
    { href: "/dashboard", label: "Invitados", key: "guests" },
    { href: "/dashboard/compras-pagos", label: "Compras y pagos", key: "budget" },
  ] as const;

  return <nav aria-label="Secciones del dashboard" className="mb-7 flex border-b border-[#24332e]/15"><div className="flex min-w-full gap-1 overflow-x-auto"><span className="mr-3 hidden py-3 font-serif text-lg sm:block">Dashboard</span>{items.map((item) => <Link key={item.key} href={item.href} className={`shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${active === item.key ? "border-[#a04d34] text-[#a04d34]" : "border-transparent text-[#24332e]/65 hover:text-[#24332e]"}`}>{item.label}</Link>)}</div></nav>;
}