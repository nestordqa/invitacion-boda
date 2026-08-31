"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { SectionReveal } from "./SectionReveal";

const accountNumber = "0000 0000 0000 0000";

export function GiftTable() {
  const [copied, setCopied] = useState(false);

  async function copyAccount() {
    await navigator.clipboard.writeText(accountNumber.replaceAll(" ", ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2_000);
  }

  return (
    <SectionReveal className="bg-[#F5F0EB] px-5 py-20 sm:px-10">
      <div className="mx-auto max-w-xl text-center text-[#4A121F]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6B1D2F]">
          Mesa de regalos
        </p>
        <h2 className="mt-4 font-serif text-4xl">Lluvia de sobres</h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#6B1D2F]/80">
          Tu presencia es nuestro regalo. Si deseas acompañarnos con un detalle,
          puedes hacerlo aquí.
        </p>
        <div className="mt-10 border border-[#C5A880] bg-white p-6 text-left sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6B1D2F]">
            Datos bancarios
          </p>
          <p className="mt-5 font-serif text-2xl">Néstor Quiñones</p>
          <p className="mt-1 text-sm">Banco por definir</p>
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#C5A880]/50 pt-5">
            <span className="font-mono text-sm tracking-[0.1em]">
              {accountNumber}
            </span>
            <button
              type="button"
              onClick={copyAccount}
              aria-label="Copiar número de cuenta"
              className="flex size-11 shrink-0 items-center justify-center border border-[#6B1D2F] text-[#6B1D2F] hover:bg-[#6B1D2F] hover:text-white"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}