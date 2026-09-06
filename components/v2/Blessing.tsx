import { Shirt } from "lucide-react";
import { CarnationDivider } from "./decor/CarnationDivider";
import { LaceFiligree } from "./decor/LaceFiligree";

export function Blessing() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] px-7 pt-16 text-center sm:px-10">
      {/* <LaceFiligree className="pointer-events-none absolute -left-10 top-1/3 w-36 text-[#D4AF37]/40" /> */}
      {/* <LaceFiligree className="pointer-events-none absolute -right-10 bottom-1/3 w-36 rotate-180 text-[#D4AF37]/40" /> */}
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
      </div>
    </section>
  );
}
