import { Shirt } from "lucide-react";
import { FloralCorner } from "./FloralCorner";
import { SectionReveal } from "./SectionReveal";

export function WeddingInfo() {
  return (
    <SectionReveal className="relative overflow-hidden bg-[#fff2dc] px-7 py-16 text-center text-[#904028] sm:px-10">
      <FloralCorner className="pointer-events-none absolute -left-10 top-64 w-40 -rotate-12 stroke-[#a71e1b] stroke-[1.1] opacity-35" />
      <FloralCorner className="pointer-events-none absolute -right-12 bottom-52 w-44 rotate-180 stroke-[#a71e1b] stroke-[1.1] opacity-35" />
      <div className="relative mx-auto max-w-md">
        <h2 className="font-script text-4xl leading-relaxed">Con la bendición de Dios y de nuestros padres.</h2>
        <div className="mt-9 font-serif text-xl leading-8">
          <p className="font-script text-3xl">Novio:</p>
          <p>Néstor Alberto Quiñones</p>
          <p>Mary Nelly Aguillón</p>
        </div>
        <div className="mt-8 font-serif text-xl leading-8">
          <p className="font-script text-3xl">Novia:</p>
          <p>Andry Moreno</p>
          <p>Jackeline Reinoza</p>
        </div>
        <div className="mt-14">
          <FloralCorner className="pointer-events-none absolute right-0 mt-3 w-28 rotate-90 stroke-[#a71e1b] stroke-[1.1] opacity-30" />
          <h2 className="font-script text-4xl">Código de vestimenta</h2>
          <p className="mx-auto mt-4 max-w-xs font-serif text-lg leading-6">Formal en los colores de su preferencia excepto el blanco que estará reservado para la novia.</p>
          <Shirt className="mx-auto mt-6 size-16 stroke-1" />
        </div>
        <div className="mt-14 font-serif text-lg leading-6">
          <h2 className="font-script text-4xl">¿Puedo llevar a alguien adicional?</h2>
          <p className="mt-3">No, esta invitación es válida para el número de pases que se indica en la descripción.</p>
          <h2 className="mt-9 font-script text-4xl">Bebidas y Celebración</h2>
          <p className="mt-3">La casa ofrecerá la copa de champaña para el brindis inicial y una botella de whisky por mesa. Puedes traer tu bebida adicional de preferencia.</p>
          <p className="mt-8 font-script text-3xl">Los niños, dulces sueños.</p>
        </div>
      </div>
    </SectionReveal>
  );
}