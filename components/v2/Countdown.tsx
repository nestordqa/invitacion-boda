"use client";

import { useEffect, useState } from "react";

const weddingDate = new Date("2026-12-29T17:30:00-04:00").getTime();

function getTimeLeft() {
  const difference = Math.max(weddingDate - Date.now(), 0);

  return {
    Días: Math.floor(difference / 86_400_000),
    Horas: Math.floor((difference / 3_600_000) % 24),
    Min: Math.floor((difference / 60_000) % 60),
    Seg: Math.floor((difference / 1_000) % 60),
  };
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ Días: 0, Horas: 0, Min: 0, Seg: 0 });

  useEffect(() => {
    const initialUpdate = window.setTimeout(() => setTimeLeft(getTimeLeft()), 0);
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft()), 1_000);

    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-start justify-center gap-3 sm:gap-5">
      {Object.entries(timeLeft).map(([label, value], index) => (
        <div key={label} className="flex items-start">
          {index > 0 && (
            <span className="mr-3 mt-1 font-(family-name:--font-pinyon) text-2xl leading-none text-[#D4AF37] sm:mr-5">
              ·
            </span>
          )}
          <div className="min-w-11 text-center sm:min-w-14">
            <p className="gold-foil-text font-(family-name:--font-montserrat) text-2xl font-semibold tabular-nums sm:text-3xl">
              {String(value).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[9px] font-(family-name:--font-montserrat) uppercase tracking-[0.16em] text-[#8a6a22]/80 sm:text-[10px]">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
