import { SectionReveal } from "./SectionReveal";
import { FloralCorner } from "./FloralCorner";

const schedule = [
  ["5:30 PM", "Ceremonia"],
  ["8:00 PM", "Recepción"],
  ["8:30 PM", "Brindis"],
  ["9:30 PM", "Sesión de fotos"],
  ["2:00 AM", "Torta y deseos"],
];

export function Itinerary() {
  return (
    <SectionReveal className="relative overflow-hidden bg-[#8d1012] px-5 py-14 text-[#fff2dc] sm:px-10">
      <FloralCorner className="pointer-events-none absolute -left-24 top-0 w-80 -rotate-12 stroke-[#fff2dc] stroke-[1.1] opacity-15 sm:w-96" />
      <FloralCorner className="pointer-events-none absolute -right-24 bottom-0 w-80 rotate-180 stroke-[#fff2dc] stroke-[1.1] opacity-15 sm:w-96" />
      <div className="relative mx-auto max-w-xl">
        <h2 className="font-script text-5xl text-center">Itinerario</h2>
        <p className="mt-4 font-serif text-lg uppercase tracking-[0.05em] text-center">29 de diciembre 2026</p>
        <dl className="mt-4">
          {schedule.map(([time, event]) => (
            <div key={time} className="grid grid-cols-[7rem_1fr] border-b border-[#fff2dc]/65 py-3 font-serif text-lg">
              <dt>{time}</dt>
              <dd>{event}</dd>
            </div>
          ))}
        </dl>
      </div>
    </SectionReveal>
  );
}