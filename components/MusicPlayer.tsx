"use client";

import { Music, Pause } from "lucide-react";
import { useRef, useState } from "react";

type MusicPlayerProps = {
  className?: string;
};

export function MusicPlayer({ className = "" }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        preload="none"
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        className={`fixed bottom-5 right-5 z-20 flex size-10 items-center justify-center rounded-full border border-[#f8d78c]/80 bg-[#8d1012]/95 text-[#f8d78c] shadow-[0_3px_8px_rgb(34_8_5_/_0.3)] transition-transform hover:scale-105 ${className}`}
      >
        {isPlaying ? <Pause className="size-3.5" /> : <Music className="size-3.5" />}
      </button>
    </>
  );
}