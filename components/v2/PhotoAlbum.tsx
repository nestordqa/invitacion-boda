import { Camera } from "lucide-react";
import Image from "next/image";
import { CarnationDivider } from "./decor/CarnationDivider";
import { CornerArrow } from "./decor/CornerArrow";
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
        <p className="mt-2 font-(family-name:--font-montserrat) text-lg leading-6 text-[#333333]">Comparte las fotos que tomes durante la boda. ¡Nos encantará verlas!</p>
        <div className="mx-auto mt-7 size-32 border p-1">
          <Image
            src="/v2/common/qr-code.png"
            alt="Código QR para abrir el álbum de fotos"
            width={128}
            height={128}
            sizes="128px"
            className="size-full object-contain"
          />
        </div>
        <div className="mt-8 flex flex-col items-center justify-center">
          <span className="font-(family-name:--font-montserrat) text-xs font-semibold uppercase tracking-[0.1em] text-[#D4AF37]">
            Pulsa aquí para ver el álbum
          </span>
          <CornerArrow className="h-8 w-18 h-32 rotate-90" />
        </div>
        <a
          href="https://photos.app.goo.gl/52EmLBVbxbu4fWbY7"
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir el álbum de fotos"
          className="mx-auto block w-fit rounded"
        >
          <Camera className="size-20 stroke-1 text-[#6B1D2F] transition-transform hover:scale-105" />
        </a>
      </div>
    </section>
  );
}
