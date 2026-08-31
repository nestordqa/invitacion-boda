"use client";

import { Music2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MusicPlayerProps = {
  className?: string;
};

export function MusicPlayer({ className = "" }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wasPausedByGuest, setWasPausedByGuest] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const audio = audioRef.current;

      if (audio) {
        void audio.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }, 1_500);

    return () => window.clearTimeout(timer);
  }, []);

  async function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      setWasPausedByGuest(true);
      audio.pause();
      return;
    }

    try {
      await audio.play();
      setWasPausedByGuest(false);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/up-theme.mp3"
        loop
        autoPlay
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        className={`fixed bottom-5 right-5 z-20 flex size-9 items-center justify-center rounded-full border border-[#fff2dc]/75 bg-transparent text-[#fff2dc] transition-colors hover:bg-[#fff2dc]/15 focus:outline-none focus:ring-2 focus:ring-[#fff2dc]/70 ${className}`}
      >
        {isPlaying ? (
          <Music2 className="size-3.5" />
        ) : wasPausedByGuest ? (
          <span className="relative flex size-3.5 items-center justify-center">
            <Music2 className="size-3.5" />
            <span className="absolute h-px w-4 rotate-45 bg-[#fff2dc]" />
          </span>
        ) : (
          <Music2 className="size-3.5" />
        )}
      </button>
    </>
  );
}