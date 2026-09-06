import { CarnationDivider } from "./decor/CarnationDivider";
import { LaceFiligree } from "./decor/LaceFiligree";
import Image from "next/image";
import { CornerArrow } from "./decor/CornerArrow";
import { PhotoBreak } from "./PhotoBreak";

export function WeddingInfo() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] px-7 pb-10 text-center sm:px-10">
      <LaceFiligree className="pointer-events-none absolute -left-10 top-1/3 w-36 text-[#D4AF37]/40" />
      <LaceFiligree className="pointer-events-none absolute -right-10 bottom-1/3 w-36 rotate-180 text-[#D4AF37]/40" />
      <div className="relative mx-auto max-w-md">
        <CarnationDivider className="mt-14" />
        <div className="mt-10">
          <h2 className="font-(family-name:--font-pinyon) text-4xl text-[#6B1D2F]">Código de vestimenta</h2>
          <p className="x-auto mt-4 max-w-xs font-(family-name:--font-montserrat) text-lg leading-6 text-[#333333]"><b>Formal</b>, en los colores de su preferencia excepto el blanco que estará reservado para la novia.</p>
          <div className="flex justify-center items-center flex-col mt-8">
            <span className="font-(family-name:--font-montserrat) text-xs font-semibold uppercase tracking-[0.1em] text-[#D4AF37]">
              Pulsa aquí para ver ejemplos
            </span>
            <CornerArrow className="h-8 w-18 h-32 rotate-90" />
          </div>
          <a
            href="https://pin.it/3462X6J6e"
            target="_blank"
            rel="noreferrer"
            aria-label="Ver inspiración para el código de vestimenta"
            className="mx-auto flex w-fit flex-col items-center rounded"
          >
            <span className="relative block size-56 sm:size-36">
              <Image
                src="/v2/common/dress-code.png"
                alt="Vestimenta formal para dama y caballero"
                width={288}
                height={288}
                sizes="288px"
                className="size-full object-contain transition-transform hover:scale-105"
              />
            </span>
          </a>
        </div>
        <PhotoBreak src="/v2/photos/backgrounds/2.jpeg" alt="Fotografía de los novios en el bosque" />

        <CarnationDivider className="mt-14" />
        <div className="mt-10 font-(family-name:--font-montserrat) text-lg leading-6 text-[#333333]">
          <h2 className="font-(family-name:--font-pinyon) text-4xl text-[#6B1D2F]">¿Puedo llevar a alguien adicional?</h2>
          <p className="mt-3">No, esta invitación es válida para el número de pases que se indica en la descripción. Los pases son personales e intransferibles y se confirmarán en la lista de invitados del evento.</p>
          <h2 className="mt-9 font-(family-name:--font-pinyon) text-4xl text-[#6B1D2F]">Bebidas y Celebración</h2>
          <p className="mt-3">La casa ofrecerá la copa de champaña para el brindis inicial y una botella de whisky por mesa. Puedes traer tu bebida adicional de preferencia.</p>
          <h2 className="mt-9 font-(family-name:--font-pinyon) text-4xl text-[#6B1D2F]">¿Puedo llevar niños?</h2>
          <p className="mt-3">La recepción será solo para adultos, agradecemos su comprensión. Niños, dulce sueños en casa; padres, en la pista de baile.</p>
        </div>
      </div>
    </section>
  );
}
