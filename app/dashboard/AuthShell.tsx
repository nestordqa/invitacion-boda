"use client";

import { Eye, EyeOff, Heart, type LucideIcon } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";

type AuthShellProps = { title: string; description?: string; children: ReactNode };

// Marco común de las pantallas de acceso al dashboard.
export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f6f3ec] px-4 py-10 text-[#24332e]">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 size-[28rem] rounded-full bg-[#a04d34]/8 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -bottom-40 size-[28rem] rounded-full bg-[#27613b]/8 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-[#24332e]/10 bg-white/90 px-7 py-9 shadow-[0_20px_60px_-25px_rgba(36,51,46,0.35)] backdrop-blur sm:px-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#a04d34]/10 text-[#a04d34]">
              <Heart className="size-5 fill-current" />
            </span>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a04d34]">Dashboard de la boda</p>
            <h1 className="mt-1 font-serif text-3xl font-medium">{title}</h1>
            {description && <p className="mt-2 text-sm leading-relaxed text-[#24332e]/65">{description}</p>}
          </div>
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-[#24332e]/50">Acceso exclusivo para los novios</p>
      </div>
    </main>
  );
}

type AuthFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & { label: string; icon: LucideIcon };

export function AuthField({ label, icon: Icon, type, ...inputProps }: AuthFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="block text-sm font-medium">
      {label}
      <span className="relative mt-2 block">
        <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#24332e]/40" />
        <input
          {...inputProps}
          type={isPassword && isVisible ? "text" : type}
          className={`min-h-12 w-full rounded-lg border border-[#24332e]/20 bg-[#fbfaf6] pl-10 text-sm transition-colors outline-none autofill:shadow-[inset_0_0_0_1000px_#fbfaf6] focus:border-[#a04d34] focus:bg-white focus:ring-3 focus:ring-[#a04d34]/10 ${isPassword ? "pr-11" : "pr-3.5"}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setIsVisible(!isVisible)} aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#24332e]/45 hover:text-[#24332e]">
            {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </span>
    </label>
  );
}

export function AuthMessage({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  return <p role={tone === "error" ? "alert" : "status"} className={`mt-5 rounded-lg px-3.5 py-3 text-sm ${tone === "error" ? "bg-[#f6dfd8] text-[#8d3024]" : "bg-[#dfece0] text-[#27613b]"}`}>{children}</p>;
}

export function AuthSubmit({ isSubmitting, label, loadingLabel }: { isSubmitting: boolean; label: string; loadingLabel: string }) {
  return <button disabled={isSubmitting} className="mt-6 min-h-12 w-full rounded-lg bg-[#24332e] px-4 text-sm font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-[#1a2622] disabled:opacity-50">{isSubmitting ? loadingLabel : label}</button>;
}
