import { CarnationDivider } from "./decor/CarnationDivider";
import { LaceFiligree } from "./decor/LaceFiligree";

const schedule = [
  ["5:30 PM", "Ceremonia"],
  ["8:00 PM", "Recepción"],
  ["8:30 PM", "Brindis"],
  ["9:30 PM", "Sesión de fotos"],
  ["2:00 AM", "Torta y deseos"],
];

export function Itinerary() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] px-5 py-14 sm:px-10">
      <LaceFiligree className="pointer-events-none absolute -left-10 bottom-0 w-44 -rotate-90 text-[#D4AF37]/40 sm:w-56" />
      <div className="relative mx-auto max-w-xl">
        <h2 className="text-center font-(family-name:--font-pinyon) text-5xl text-[#6B1D2F]">Itinerario</h2>
        <p className="mt-4 text-center font-(family-name:--font-montserrat) text-lg uppercase tracking-wider text-[#333333]">29 de diciembre 2026</p>
        <CarnationDivider className="mt-4" />
        <dl className="mt-6">
          {schedule.map(([time, event]) => (
            <div key={time} className="grid grid-cols-[7rem_1fr] border-b border-[#D4AF37]/40 py-3 font-(family-name:--font-montserrat) text-lg text-[#333333]">
              <dt className="text-[#6B1D2F]">{time}</dt>
              <dd>{event}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
