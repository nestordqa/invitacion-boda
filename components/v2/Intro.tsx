"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Countdown } from "./Countdown";
import { LaceFiligree } from "./decor/LaceFiligree";
import { SparkleArrow } from "./decor/SparkleArrow";

type IntroProps = {
  showCta: boolean;
  onNavigateNext: () => void;
};

// Portada: título sobre el fondo floral, contador entre las flores; el acceso a la siguiente sección solo aparece tras activar la música.
export function Intro({ showCta, onNavigateNext }: IntroProps) {
  return (
    <section className="relative flex h-svh flex-col items-center overflow-hidden">
      <Image
        src="/v2/flowers-background.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#FDFBF7]/20" />
      <LaceFiligree className="pointer-events-none absolute -left-6 -top-6 w-40 text-[#8a6a22]/70 sm:w-56" />
      <LaceFiligree className="pointer-events-none absolute -left-6 -top-6 w-40 rotate-3 text-[#f7e7a6]/60 sm:w-56" />
      <LaceFiligree className="pointer-events-none absolute -bottom-6 -right-6 w-40 rotate-180 text-[#8a6a22]/70 sm:w-56" />
      <LaceFiligree className="pointer-events-none absolute -bottom-6 -right-6 w-40 rotate-183 text-[#f7e7a6]/60 sm:w-56" />
      <div className="relative flex flex-col items-center px-6 pt-44 sm:pt-50">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, scale: [1, 1.015, 1] }}
          transition={{
            opacity: { duration: 0.9, ease: "easeOut" },
            y: { duration: 0.9, ease: "easeOut" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
          }}
          className="text-center font-(family-name:--font-pinyon) text-6xl leading-tight text-[#6B1D2F] drop-shadow-[0_2px_10px_rgba(253,251,247,0.85)] sm:text-8xl"
        >
          Néstor &amp; Valentina&apos;s Wedding
        </motion.h1>
        <motion.span
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="gold-foil-rule mt-6 w-40 sm:w-56"
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, scale: [1, 1.03, 1] }}
          transition={{
            opacity: { duration: 0.9, delay: 0.2, ease: "easeOut" },
            y: { duration: 0.9, delay: 0.2, ease: "easeOut" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.1 },
          }}
          className="mt-8"
        >
          <Countdown />
        </motion.div>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center gap-2">
        <AnimatePresence>
          {showCta && (
            <motion.button
              type="button"
              onClick={onNavigateNext}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="gold-foil-text font-(family-name:--font-montserrat) text-sm font-semibold uppercase tracking-[0.14em]">
                Pulsa aquí
              </span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <SparkleArrow className="h-24 w-24" />
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


