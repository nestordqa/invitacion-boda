import { Church, Clock3, ExternalLink, MapPinned, PartyPopper } from "lucide-react";
import { FloralCorner } from "./FloralCorner";
import { SectionReveal } from "./SectionReveal";

const events = [
  { title: "La ceremonia", place: "Basílica Catedral de la Inmaculada Concepción", time: "5:30 P. M.", map: "https://maps.app.goo.gl/6Bo6cBJmGqapTupt7?g_st=ic" },
  { title: "La celebración", place: "Salón de eventos Nova Roma, Av. Los Próceres", time: "8:00 P. M.", map: "https://maps.app.goo.gl/wYSnXfmuZxRpF3Vr9?g_st=ic" },
];

export function EventDetails() {
  return (
    <SectionReveal className="relative overflow-hidden bg-[#8d1012] px-5 py-16 text-[#fff2dc] sm:px-10">
      <FloralCorner className="pointer-events-none absolute -left-20 top-28 w-72 -rotate-12 stroke-[#fff2dc] stroke-[1.1] opacity-15 sm:w-96" />
      <FloralCorner className="pointer-events-none absolute -right-24 bottom-0 w-72 rotate-[150deg] stroke-[#fff2dc] stroke-[1.1] opacity-15 sm:w-96" />
      <div className="relative mx-auto max-w-xl">
        <h2 className="text-center font-script text-5xl">La Ceremonia</h2>
        <div className="mt-10 grid grid-cols-2 gap-6 text-center">
          {events.map((event) => (
            <article key={event.title}>
              {event.title === "La ceremonia" ? (
                <Church className="mx-auto size-12 stroke-1" />
              ) : (
                <PartyPopper className="mx-auto size-12 stroke-1" />
              )}
              <h3 className="mt-3 font-serif text-lg">{event.title}</h3>
              <p className="mt-2 text-xs leading-4">{event.place}</p>
              <p className="mt-5 flex items-center justify-center gap-2 font-serif text-xl">
                <Clock3 className="size-4" />
                {event.time}
              </p>
              <a
                href={event.map}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 border border-[#fff2dc]/70 px-3 text-xs transition-colors hover:bg-[#fff2dc] hover:text-[#8d1012]"
              >
                <MapPinned className="size-4" />
                Ver ubicación
                <ExternalLink className="size-3" />
              </a>
            </article>
          ))}
        </div>
        <div className="mt-14 flex aspect-[4/3] items-center justify-center border border-[#fff2dc]/70 bg-white text-xs uppercase tracking-[0.2em] text-[#7b351f]/60">Fotografía de la pareja</div>
      </div>
    </SectionReveal>
  );
}