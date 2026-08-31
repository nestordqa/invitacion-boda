import { Camera } from "lucide-react";
import { FloralCorner } from "./FloralCorner";
import { SectionReveal } from "./SectionReveal";

export function PhotoAlbum() {
  return (
    <SectionReveal className="relative overflow-hidden bg-[#fff2dc] px-5 py-16 text-center text-[#7b351f] sm:px-10">
      <FloralCorner className="pointer-events-none absolute -left-20 top-8 w-64 -rotate-12 stroke-[#a71e1b] stroke-[1.1] opacity-30 sm:w-80" />
      <FloralCorner className="pointer-events-none absolute -right-20 bottom-4 w-64 rotate-180 stroke-[#a71e1b] stroke-[1.1] opacity-30 sm:w-80" />
      <div className="relative mx-auto max-w-md">
        <h2 className="font-script text-6xl leading-none">Álbum de fotos</h2>
        <p className="mt-6 font-serif text-xl">Ayúdanos a inmortalizar cada momento</p>
        <Camera className="mx-auto mt-7 size-20 stroke-1 text-[#a71e1b]" />
        <p className="mt-5 font-serif text-lg">(Pulsa para acceder al álbum)</p>
        <p className="mt-2 font-serif text-lg leading-6">Comparte las fotos que tomes durante la boda. ¡Nos encantará verlas!</p>
        <div className="mx-auto mt-7 flex size-28 items-center justify-center border border-[#a71e1b] bg-white text-[9px] uppercase tracking-[0.16em]">QR del álbum</div>
        <div className="mt-10 flex aspect-[3/4] items-center justify-center border border-[#a71e1b] bg-white text-xs uppercase tracking-[0.2em] text-[#7b351f]/55">Fotografía de los novios</div>
      </div>
    </SectionReveal>
  );
}