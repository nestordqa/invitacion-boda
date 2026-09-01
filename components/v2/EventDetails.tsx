import { Church, Clock3, ExternalLink, MapPinned, PartyPopper } from "lucide-react";
import { CarnationDivider } from "./decor/CarnationDivider";
import { LaceFiligree } from "./decor/LaceFiligree";

const events = [
  { title: "La ceremonia", place: "Basílica Catedral de la Inmaculada Concepción", time: "5:30 P. M.", map: "https://maps.app.goo.gl/6Bo6cBJmGqapTupt7?g_st=ic" },
  { title: "La celebración", place: "Salón de eventos Nova Roma, Av. Los Próceres", time: "8:00 P. M.", map: "https://maps.app.goo.gl/wYSnXfmuZxRpF3Vr9?g_st=ic" },
];

export function EventDetails() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] px-5 py-16 sm:px-10">
      <LaceFiligree className="pointer-events-none absolute -right-10 top-10 w-44 rotate-90 text-[#D4AF37]/40 sm:w-56" />
      <div className="relative mx-auto max-w-xl">
        <h2 className="text-center font-(family-name:--font-pinyon) text-5xl text-[#6B1D2F]">La Ceremonia</h2>
        <CarnationDivider className="mt-4" />
        <div className="mt-10 grid grid-cols-2 gap-6 text-center">
          {events.map((event) => (
            <article key={event.title}>
              {event.title === "La ceremonia" ? (
                <Church className="mx-auto size-12 stroke-1 text-[#6B1D2F]" />
              ) : (
                <PartyPopper className="mx-auto size-12 stroke-1 text-[#6B1D2F]" />
              )}
              <h3 className="mt-3 font-(family-name:--font-pinyon) text-2xl text-[#6B1D2F]">{event.title}</h3>
              <p className="mt-2 text-xs leading-4 text-[#333333]">{event.place}</p>
              <p className="mt-5 flex items-center justify-center gap-2 font-(family-name:--font-montserrat) text-xl text-[#333333]">
                <Clock3 className="size-4" />
                {event.time}
              </p>
              <a
                href={event.map}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 border border-[#D4AF37] px-3 text-xs text-[#6B1D2F] transition-colors hover:bg-[#6B1D2F] hover:text-[#FDFBF7]"
              >
                <MapPinned className="size-4" />
                Ver ubicación
                <ExternalLink className="size-3" />
              </a>
            </article>
          ))}
        </div>
        <div className="mt-14 flex aspect-4/3 items-center justify-center border border-[#D4AF37] bg-white text-xs uppercase tracking-[0.2em] text-[#333333]/55">Fotografía de la pareja</div>
      </div>
    </section>
  );
}
