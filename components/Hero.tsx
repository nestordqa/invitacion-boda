"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FloralCorner } from "./FloralCorner";

const weddingDate = new Date("2026-12-29T17:30:00-04:00").getTime();

function getTimeLeft() {
  const difference = Math.max(weddingDate - Date.now(), 0);
  return {
    dias: Math.floor(difference / 86_400_000),
    horas: Math.floor((difference / 3_600_000) % 24),
    min: Math.floor((difference / 60_000) % 60),
    seg: Math.floor((difference / 1_000) % 60),
  };
}

export function Hero() {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#fff2dc] px-5 py-10 text-[#7b351f] sm:px-10">
      <FloralCorner className="pointer-events-none absolute -left-14 -top-12 w-52 -rotate-12 stroke-[#a71e1b] stroke-[1.1] opacity-35 sm:w-64" />
      <FloralCorner className="pointer-events-none absolute -right-16 top-40 w-56 rotate-[130deg] stroke-[#a71e1b] stroke-[1.1] opacity-30 sm:w-72" />
      <FloralCorner className="pointer-events-none absolute -bottom-16 -left-16 w-60 -rotate-45 stroke-[#a71e1b] stroke-[1.1] opacity-30 sm:w-72" />
      <motion.div className="relative mx-auto flex w-full max-w-xl flex-col items-center text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <p className="font-serif text-sm uppercase tracking-[0.08em]">29 de diciembre 2026</p>
        <p className="mt-5 font-script text-6xl leading-[0.72] sm:text-7xl">Néstor &amp;<br />Valentina</p>
        <div className="mt-12 flex aspect-[4/3] w-full max-w-[20.5rem] items-center justify-center border border-[#a71e1b] bg-white" aria-label="Espacio reservado para la fotografía principal">
          <span className="text-xs uppercase tracking-[0.2em] text-[#7b351f]/55">Fotografía principal</span>
        </div>
        <h1 className="mt-7 font-script text-5xl leading-tight text-[#a71e1b] sm:text-6xl">Te invitamos a<br />Nuestra Boda</h1>
        <div className="mt-8 grid w-full max-w-sm grid-cols-4 border-y border-[#d6a38f] py-4">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="border-r border-[#d6a38f] last:border-0">
              <p className="font-serif text-2xl tabular-nums">{String(value).padStart(2, "0")}</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.16em]">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}