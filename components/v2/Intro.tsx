"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type IntroProps = {
  guest: {
    name: string;
    family: boolean;
  } | null;
  showCta: boolean;
  onNavigateNext: () => void;
};

// The letter cover stays gated until the guest starts the soundtrack.
export function Intro({ guest, showCta, onNavigateNext }: IntroProps) {
  const guestName = guest ? (guest.family ? `Flia. ${guest.name}` : guest.name) : "Bienvenido";

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#21140f]">
      <Image
        src="/letter/letter-4.jpg?v=2"
        alt="Sobre de invitación de boda de Néstor y Valentina"
        priority
        width={704}
        height={1520}
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-contain object-center"
      />
      <div className="absolute inset-0 bg-[#21140f]/20" />
      <p className="pointer-events-none absolute left-1/2 top-[63%] z-10 w-[min(80%,20rem)] -translate-x-1/2 text-center text-[#553b16] font-(family-name:--font-pinyon) text-3xl font-medium tracking-[0.12em] sm:text-xl">
        {guestName}
      </p>
      {showCta && (
        <motion.button
          type="button"
          onClick={onNavigateNext}
          aria-label="Pulsar el sello para abrir la carta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute left-1/2 top-[42%] z-20 size-24 -translate-x-1/2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f7e7a6]/80 sm:size-28"
        />
      )}
      <div className="absolute inset-x-0 bottom-32 z-10 flex justify-center">
        <AnimatePresence>
          {showCta && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col-reverse items-center gap-1"
            >
              <span className="gold-foil-text font-(family-name:--font-montserrat) text-center text-sm font-semibold uppercase tracking-[0.1em]">
                Pulsa el sello para abrir la carta
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


