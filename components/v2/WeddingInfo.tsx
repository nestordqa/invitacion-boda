import { Shirt } from "lucide-react";
import { CarnationDivider } from "./decor/CarnationDivider";
import { LaceFiligree } from "./decor/LaceFiligree";

export function WeddingInfo() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] px-7 py-16 text-center sm:px-10">
      <LaceFiligree className="pointer-events-none absolute -left-10 top-1/3 w-36 text-[#D4AF37]/40" />
      <LaceFiligree className="pointer-events-none absolute -right-10 bottom-1/3 w-36 rotate-180 text-[#D4AF37]/40" />
      <div className="relative mx-auto max-w-md">
        <h2 className="font-(family-name:--font-pinyon) text-4xl leading-relaxed text-[#6B1D2F]">Con la bendición de Dios y de nuestros padres.</h2>
        <div className="mt-9 font-(family-name:--font-montserrat) text-xl leading-8 text-[#333333]">
          <p className="font-(family-name:--font-pinyon) text-3xl text-[#6B1D2F]">Novio:</p>
          <p>Néstor Alberto Quiñones</p>
          <p>Mary Nelly Aguillón</p>
        </div>
        <div className="mt-8 font-(family-name:--font-montserrat) text-xl leading-8 text-[#333333]">
          <p className="font-(family-name:--font-pinyon) text-3xl text-[#6B1D2F]">Novia:</p>
          <p>Andry Moreno</p>
          <p>Jackeline Reinoza</p>
        </div>

        <CarnationDivider className="mt-14" />
        <div className="mt-10">
          <h2 className="font-(family-name:--font-pinyon) text-4xl text-[#6B1D2F]">Código de vestimenta</h2>
          <p className="mx-auto mt-4 max-w-xs font-(family-name:--font-montserrat) text-lg leading-6 text-[#333333]">Formal en los colores de su preferencia excepto el blanco que estará reservado para la novia.</p>
          <Shirt className="mx-auto mt-6 size-16 stroke-1 text-[#6B1D2F]" />
        </div>

        <CarnationDivider className="mt-14" />
        <div className="mt-10 font-(family-name:--font-montserrat) text-lg leading-6 text-[#333333]">
          <h2 className="font-(family-name:--font-pinyon) text-4xl text-[#6B1D2F]">¿Puedo llevar a alguien adicional?</h2>
          <p className="mt-3">No, esta invitación es válida para el número de pases que se indica en la descripción.</p>
          <h2 className="mt-9 font-(family-name:--font-pinyon) text-4xl text-[#6B1D2F]">Bebidas y Celebración</h2>
          <p className="mt-3">La casa ofrecerá la copa de champaña para el brindis inicial y una botella de whisky por mesa. Puedes traer tu bebida adicional de preferencia.</p>
          <p className="mt-8 font-(family-name:--font-pinyon) text-3xl text-[#6B1D2F]">Los niños, dulces sueños.</p>
        </div>
      </div>
    </section>
  );
}
