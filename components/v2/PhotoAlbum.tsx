import { Camera } from "lucide-react";
import { CarnationDivider } from "./decor/CarnationDivider";
import { LaceFiligree } from "./decor/LaceFiligree";

export function PhotoAlbum() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] px-5 py-16 text-center sm:px-10">
      <LaceFiligree className="pointer-events-none absolute -left-10 -top-6 w-44 text-[#D4AF37]/40 sm:w-56" />
      <LaceFiligree className="pointer-events-none absolute -right-10 -bottom-6 w-44 rotate-180 text-[#D4AF37]/40 sm:w-56" />
      <div className="relative mx-auto max-w-md">
        <h2 className="font-(family-name:--font-pinyon) text-6xl leading-none text-[#6B1D2F]">Álbum de fotos</h2>
        <p className="mt-6 font-(family-name:--font-montserrat) text-xl text-[#333333]">Ayúdanos a inmortalizar cada momento</p>
        <CarnationDivider className="mt-6" />
        <Camera className="mx-auto mt-7 size-20 stroke-1 text-[#6B1D2F]" />
        <p className="mt-5 font-(family-name:--font-montserrat) text-lg text-[#333333]">(Pulsa para acceder al álbum)</p>
        <p className="mt-2 font-(family-name:--font-montserrat) text-lg leading-6 text-[#333333]">Comparte las fotos que tomes durante la boda. ¡Nos encantará verlas!</p>
        <div className="mx-auto mt-7 flex size-28 items-center justify-center border border-[#D4AF37] bg-white text-[9px] uppercase tracking-[0.16em] text-[#333333]">QR del álbum</div>
        <div className="mt-10 flex aspect-3/4 items-center justify-center border border-[#D4AF37] bg-white text-xs uppercase tracking-[0.2em] text-[#333333]/55">Fotografía de los novios</div>
      </div>
    </section>
  );
}
