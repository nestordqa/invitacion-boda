"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PhotoBreakProps = {
  src: string;
  alt: string;
};

export function PhotoBreak({ src, alt }: PhotoBreakProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [imageStyle, setImageStyle] = useState({
    clipPath: "inset(100% 0 0 0)",
    opacity: 0,
  });

  useEffect(() => {
    let frame = 0;

    const updateImagePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        const bounds = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isVisible = bounds.bottom > 0 && bounds.top < viewportHeight;
        const top = Math.max(0, bounds.top);
        const bottom = Math.max(0, viewportHeight - bounds.bottom);

        setImageStyle({
          clipPath: `inset(${top}px 0 ${bottom}px 0)`,
          opacity: isVisible ? 1 : 0,
        });
      });
    };

    updateImagePosition();
    window.addEventListener("scroll", updateImagePosition, { passive: true });
    window.addEventListener("resize", updateImagePosition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateImagePosition);
      window.removeEventListener("resize", updateImagePosition);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      role="img"
      aria-label={alt}
      className="relative h-[33vh] min-h-48 w-screen overflow-hidden bg-[#21140f]"
      style={{ marginLeft: "calc(50% - 50vw)" }}
    >
      <div className="pointer-events-none fixed inset-0 z-0" style={imageStyle} aria-hidden="true">
        <Image src={src} alt="" fill unoptimized sizes="100vw" className="object-cover object-center" />
      </div>
      <div className="absolute inset-0 bg-[#21140f]/15" aria-hidden="true" />
    </section>
  );
}
