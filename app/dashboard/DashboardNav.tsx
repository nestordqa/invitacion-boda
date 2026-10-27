import { Heart, KeyRound } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

type DashboardNavProps = { active: "guests" | "tables" | "budget" };

export function DashboardNav({ active }: DashboardNavProps) {
  const items = [
    { href: "/dashboard", label: "Invitados", key: "guests" },
    { href: "/dashboard/organizacion-mesas", label: "Organización de mesas", key: "tables" },
    { href: "/dashboard/compras-pagos", label: "Compras y pagos", key: "budget" },
  ] as const;

  return (
    <nav aria-label="Secciones del dashboard" className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#24332e]/10 bg-white/80 p-2 shadow-[0_12px_32px_-24px_rgba(36,51,46,0.45)] backdrop-blur">
      <span className="hidden items-center gap-2 pr-2 pl-3 font-serif text-lg sm:flex">
        <span className="flex size-8 items-center justify-center rounded-full bg-[#a04d34]/10 text-[#a04d34]"><Heart className="size-4 fill-current" /></span>
        Dashboard
      </span>
      <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {items.map((item) => (
          <Link key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${active === item.key ? "bg-[#24332e] text-white shadow-sm" : "text-[#24332e]/65 hover:bg-[#24332e]/5 hover:text-[#24332e]"}`}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Link href="/dashboard/set-password" className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[#24332e]/65 transition-colors hover:bg-[#24332e]/5 hover:text-[#24332e]"><KeyRound className="size-4" /><span className="hidden lg:inline">Cambiar contraseña</span></Link>
        <LogoutButton />
      </div>
    </nav>
  );
}
