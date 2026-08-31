"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { EnvelopeCountdown } from "./EnvelopeCountdown";
import { MusicPlayer } from "./MusicPlayer";

type EnvelopeCoverProps = {
  children: ReactNode;
};

export function EnvelopeCover({ children }: EnvelopeCoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (!isOpening) {
      return;
    }

    const timer = window.setTimeout(() => setIsOpen(true), 1_150);
    return () => window.clearTimeout(timer);
  }, [isOpening]);

  function openInvitation() {
    if (!isOpening) {
      setIsOpening(true);
    }
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden bg-[#21140f]"
        initial={false}
        animate={{ opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? "none" : "auto" }}
        transition={{ opacity: { duration: 0.45 } }}
        aria-hidden={isOpen}
      >
        <div className="absolute inset-0 scale-110 bg-[url('/letter/letter.jpg?v=2')] bg-cover bg-center opacity-30 blur-2xl md:opacity-45" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: isOpening ? 1.12 : 1, y: isOpening ? -18 : 0 }}
          transition={{ duration: 1.05, ease: [0.22, 0.8, 0.2, 1] }}
        >
          <div className="relative aspect-[704/1520] h-[min(100svh,calc(100vw*2.1591))] shadow-2xl">
            <Image
              src="/letter/letter.jpg?v=2"
              alt="Sobre de invitación de boda de Néstor y Valentina"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 47vh"
              className="object-contain"
            />
            <motion.button
              type="button"
              onClick={openInvitation}
              aria-label="Abrir invitación"
              className="absolute left-1/2 top-[53%] z-10 size-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus:ring-4 focus:ring-[#f8d78c]/80"
              animate={{ scale: isOpening ? [1, 0.88, 0] : 1, opacity: isOpening ? [1, 1, 0] : 1 }}
              transition={{ duration: 0.45, times: [0, 0.35, 1], ease: "easeInOut" }}
              whileTap={{ scale: 0.9 }}
              disabled={isOpening}
            >
              <span className="sr-only">Toca el sello para abrir</span>
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[#fff4df]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpening ? [0, 0.16, 0] : 0 }}
          transition={{ duration: 0.8, times: [0, 0.2, 1] }}
        />
        <MusicPlayer className="right-4 top-4 z-[60] bottom-auto sm:right-6 sm:top-6" />
        <div className="absolute inset-x-4 bottom-5 z-[60] mx-auto w-fit sm:bottom-7">
          <EnvelopeCountdown />
        </div>
      </motion.div>
      {children}
    </>
  );
}
