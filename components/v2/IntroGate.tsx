"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Intro } from "./Intro";
import { MusicPlayer } from "./MusicPlayer";
import { NextChapter } from "./NextChapter";

type Stage = "intro" | "next" | "unlocked";

type IntroGateProps = {
  guest: {
    name: string;
    family: boolean;
  } | null;
};

// Gates the intro flow: scroll stays locked through Intro/NextChapter and only
// advances via explicit taps, never native scrolling. Music must start before
// the "Pulsa aquí" CTA appears; once past Intro the hint disappears but the
// music toggle keeps working without affecting the rest of the flow.
export function IntroGate({ guest }: IntroGateProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stage, setStage] = useState<Stage>("intro");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = stage === "unlocked" ? previousOverflow || "" : "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [stage]);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/v2/sountrack.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} showHint={stage === "intro"} />
      {stage !== "unlocked" && (
        <div className="relative h-svh w-full overflow-hidden">
          <AnimatePresence mode="wait">
            {stage === "intro" ? (
              <motion.div
                key="intro"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.5, ease: "easeIn" } }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Intro guest={guest} showCta={isPlaying} onNavigateNext={() => setStage("next")} />
              </motion.div>
            ) : (
              <motion.div
                key="next"
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <NextChapter guest={guest} onEnterInvitation={() => setStage("unlocked")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
