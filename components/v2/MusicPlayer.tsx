"use client";

import { Music2, Pause } from "lucide-react";
import { CornerArrow } from "./decor/CornerArrow";

type MusicPlayerProps = {
  isPlaying: boolean;
  onToggle: () => void;
  showHint: boolean;
};

// Fixed top-right control that plays the V2 soundtrack; the hint only shows during the intro gate.
export function MusicPlayer({ isPlaying, onToggle, showHint }: MusicPlayerProps) {
  return (
    <div className="fixed right-4 top-4 z-50 flex items-start gap-1.5">
      {showHint && (
        <div className="mt-1 max-w-24 text-right">
          <p className="gold-foil-text font-(family-name:--font-montserrat) text-[10px] font-semibold uppercase leading-tight tracking-[0.06em]">
            Pulsa aquí para que ocurra la magia
          </p>
          <CornerArrow className="ml-auto mt-1 h-8 w-10" />
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        className="gold-foil-frame music-btn-pulse shrink-0 rounded-full"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-[#FDFBF7]/90 text-[#8a6a22] transition-colors hover:bg-[#FDFBF7]">
          {isPlaying ? <Pause className="size-4" /> : <Music2 className="size-4" />}
        </span>
      </button>
    </div>
  );
}

