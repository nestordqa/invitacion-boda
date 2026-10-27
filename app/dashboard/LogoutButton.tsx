"use client";

import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.replace("/dashboard/login");
    router.refresh();
  }

  return <button type="button" onClick={() => void logout()} className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[#24332e]/65 transition-colors hover:bg-[#a04d34]/10 hover:text-[#a04d34]"><LogOut className="size-4" /><span className="hidden lg:inline">Cerrar sesión</span></button>;
}
