import { CakeSlice, Camera, Church, Heart, Music2, PartyPopper, Wine } from "lucide-react";
import { CarnationDivider } from "./decor/CarnationDivider";
import { LaceFiligree } from "./decor/LaceFiligree";

const schedule = [
  { time: "5:30 PM", event: "Ceremonia", icon: Church },
  { time: "8:00 PM", event: "Recepción", icon: PartyPopper },
  { time: "8:30 PM", event: "Brindis", icon: Wine },
  { time: "9:30 PM", event: "Sesión de fotos", icon: Camera },
  { time: "12:00 AM", event: "Hora loca", icon: Music2 },
  { time: "2:00 AM", event: "Torta y deseos", icon: CakeSlice },
];

export function Itinerary() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] px-5 py-14 sm:px-10">
      <LaceFiligree className="pointer-events-none absolute -left-10 bottom-0 w-44 -rotate-90 text-[#D4AF37]/40 sm:w-56" />
      <div className="relative mx-auto max-w-xl">
        <h2 className="text-center font-(family-name:--font-pinyon) text-5xl text-[#6B1D2F]">Itinerario</h2>
        <p className="mt-4 text-center font-(family-name:--font-montserrat) text-lg uppercase tracking-wider text-[#333333]">29 de diciembre 2026</p>
        <CarnationDivider className="mt-4" />
        <dl className="relative mt-10">
          <div className="absolute bottom-5 left-1/2 top-5 w-px -translate-x-1/2 bg-[#6B1D2F]/70" aria-hidden="true" />
          {schedule.map(({ time, event, icon: EventIcon }, index) => (
            <div key={time} className="relative grid min-h-32 grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] items-center gap-3 py-4">
              <div className={index % 2 === 0 ? "order-1 text-right" : "order-3 text-left"}>
                <dt className="font-(family-name:--font-montserrat) text-sm font-semibold tracking-wide text-[#6B1D2F] sm:text-base">{time}</dt>
                <dd className="mt-1 font-(family-name:--font-pinyon) text-2xl leading-tight text-[#6B1D2F] sm:text-3xl">{event}</dd>
              </div>
              <div className="z-10 order-2 flex size-9 items-center justify-center rounded-full bg-[#FDFBF7] text-[#6B1D2F]">
                <Heart className="size-5 fill-[#D4AF37] text-[#6B1D2F]" aria-hidden="true" />
              </div>
              <div className={index % 2 === 0 ? "order-3 flex justify-start" : "order-1 flex justify-end"}>
                <EventIcon className="size-16 stroke-[1.2] text-[#B08A32] sm:size-20" aria-hidden="true" />
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
