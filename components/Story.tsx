import { SectionReveal } from "./SectionReveal";
import { FloralCorner } from "./FloralCorner";

export function Story() {
  return (
    <SectionReveal className="relative overflow-hidden bg-[#fff2dc] px-7 py-16 text-center text-[#904028] sm:px-10">
      <FloralCorner className="pointer-events-none absolute -left-20 top-2 w-64 -rotate-12 stroke-[#a71e1b] stroke-[1.1] opacity-30 sm:w-80" />
      <FloralCorner className="pointer-events-none absolute -right-20 -bottom-10 w-64 rotate-180 stroke-[#a71e1b] stroke-[1.1] opacity-30 sm:w-80" />
      <div className="relative mx-auto max-w-md">
        <p className="font-serif text-lg leading-6">
          Queremos celebrar junto a nuestros seres queridos la unión de nuestras vidas en matrimonio.
          Acompáñanos en este día tan especial, donde compartiremos risas, lágrimas de felicidad
          y momentos inolvidables. Tu presencia será el mejor regalo en esta nueva aventura que comenzamos juntos.
        </p>
      </div>
    </SectionReveal>
  );
}