import { Church, ChevronDown, Clock3, ExternalLink, MapPinned, PartyPopper } from "lucide-react";
import Image from "next/image";
import { CarnationDivider } from "./decor/CarnationDivider";
import { LaceFiligree } from "./decor/LaceFiligree";

const events = [
  { title: "La ceremonia", place: "Basílica Catedral de la Inmaculada Concepción", time: "5:30 P. M.", map: "https://maps.app.goo.gl/6Bo6cBJmGqapTupt7?g_st=ic" },
  { title: "La celebración", place: "Salón de eventos Nova Roma, Av. Los Próceres", time: "8:00 P. M.", map: "https://maps.app.goo.gl/wYSnXfmuZxRpF3Vr9?g_st=ic" },
];

export function EventDetails() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden bg-transparent px-5 py-12 sm:px-10">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <Image
          src="/v2/photos/backgrounds/1.JPEG"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#21140f]/55" aria-hidden="true" />
      <LaceFiligree className="pointer-events-none absolute -right-10 top-10 z-10 w-44 rotate-90 text-[#D4AF37]/40 sm:w-56" />
      <div className="relative z-10 mx-auto w-full max-w-xl">
        <h2 className="text-center font-(family-name:--font-pinyon) text-5xl text-[#F7E7A6] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">La Ceremonia</h2>
        <CarnationDivider className="mt-4" />
        <div className="mt-10 grid grid-cols-2 gap-6 text-center">
          {events.map((event) => (
            <article key={event.title}>
              {event.title === "La ceremonia" ? (
                <Church className="mx-auto size-12 stroke-1 text-[#F7E7A6] drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]" />
              ) : (
                <PartyPopper className="mx-auto size-12 stroke-1 text-[#F7E7A6] drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]" />
              )}
              <h3 className="mt-3 font-(family-name:--font-pinyon) text-3xl text-[#F7E7A6] drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">{event.title}</h3>
              <p className="mt-2 text-xs leading-4 text-[#FDFBF7] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{event.place}</p>
              <p className="mt-5 flex items-center justify-center gap-2 font-(family-name:--font-montserrat) text-xl text-[#FDFBF7] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                <Clock3 className="size-4 text-[#F7E7A6]" />
                {event.time}
              </p>
              <a
                href={event.map}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 border border-[#F7E7A6] bg-[#21140f]/45 px-3 text-xs text-[#F7E7A6] shadow-[0_2px_4px_rgba(0,0,0,0.45)] backdrop-blur-[2px] transition-colors hover:bg-[#F7E7A6] hover:text-[#21140f]"
              >
                <MapPinned className="size-4" />
                Ver ubicación
                <ExternalLink className="size-3" />
              </a>
            </article>
          ))}
        </div>
      </div>
      <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-row items-center gap-1 rounded-full text-[#F7E7A6] backdrop-blur-[2px] w-full justify-center items-center" aria-hidden="true">
        <span className="font-(family-name:--font-montserrat) text-[12px] font-semibold uppercase tracking-[0.12em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          Desliza hacia abajo
        </span>
        <ChevronDown className="size-5 animate-bounce drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
      </div>
    </section>
  );
}
