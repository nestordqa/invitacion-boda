"use client";

import { useEffect, useState } from "react";

const weddingDate = new Date("2026-12-29T17:30:00-04:00").getTime();

function getTimeLeft() {
  const difference = Math.max(weddingDate - Date.now(), 0);

  return {
    días: Math.floor(difference / 86_400_000),
    horas: Math.floor((difference / 3_600_000) % 24),
    min: Math.floor((difference / 60_000) % 60),
    seg: Math.floor((difference / 1_000) % 60),
  };
}

export function EnvelopeCountdown() {
  const [timeLeft, setTimeLeft] = useState({ días: 0, horas: 0, min: 0, seg: 0 });

  useEffect(() => {
    const initialUpdate = window.setTimeout(() => setTimeLeft(getTimeLeft()), 0);
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft()), 1_000);

    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-[min(23rem,calc(100vw-1.25rem))] text-center text-[#fff2dc]">
      <div className="flex items-start justify-center">
        {Object.entries(timeLeft).map(([label, value], index) => (
          <div key={label} className="flex items-start">
            {index > 0 && <span className="mt-1 px-2 font-serif text-xl leading-none text-[#f8d78c]/80">·</span>}
            <div className="min-w-12">
              <p className="font-serif text-2xl leading-none tabular-nums sm:text-3xl">{String(value).padStart(2, "0")}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[#f8d78c]">{label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-3 h-px w-16 bg-[#f8d78c]/70" />
      <p className="mx-auto mt-3 max-w-[21rem] font-serif text-base leading-5 text-[#fff2dc] sm:text-lg">
        Hay caminos que nacen para cruzarse y almas que nacen para encontrarse.
        Bienvenidos al inicio de nuestro capítulo más hermoso.
      </p>
    </div>
  );
}