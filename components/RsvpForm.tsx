"use client";

import { Check, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { RSVP_DEADLINE_LABEL, isRsvpOpen } from "@/utils/wedding";
import { FloralCorner } from "./FloralCorner";
import { SectionReveal } from "./SectionReveal";

type RsvpGuest = {
  name: string;
  family: boolean;
  passes_number: number;
  confirmation: "pending" | "confirmed" | "declined";
  used_passes_confirmed: number;
  guest_observation: string | null;
} | null;

type RsvpFormProps = { guest: RsvpGuest; token?: string };

export function RsvpForm({ guest, token }: RsvpFormProps) {
  const isPreviouslyAnswered = guest?.confirmation === "confirmed" || guest?.confirmation === "declined";
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(guest?.confirmation === "confirmed" ? "yes" : guest?.confirmation === "declined" ? "no" : null);
  const [passes, setPasses] = useState(guest?.confirmation === "confirmed" ? guest.used_passes_confirmed : 1);
  const [observation, setObservation] = useState(guest?.guest_observation || "");
  const [submitted, setSubmitted] = useState(false);
  const [showDeclinedModal, setShowDeclinedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const rsvpOpen = isRsvpOpen();
  const passOptions = Array.from({ length: guest?.passes_number || 0 }, (_, index) => index + 1);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !guest || !attendance) return;
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          confirmation: attendance === "yes" ? "confirmed" : "declined",
          used_passes_confirmed: attendance === "yes" ? passes : 0,
          guest_observation: observation,
        }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "No se pudo guardar tu respuesta.");
      }
      setSubmitted(true);
      setShowDeclinedModal(attendance === "no");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo guardar tu respuesta.");
    } finally {
      setIsSubmitting(false);
    }
  }

    return (
      <SectionReveal className="relative overflow-hidden bg-[#8d1012] px-5 py-16 text-[#fff2dc] sm:px-10">
        <FloralCorner className="pointer-events-none absolute -left-24 top-4 w-72 -rotate-12 stroke-[#fff2dc] stroke-[1.1] opacity-15 sm:w-96" />
        <FloralCorner className="pointer-events-none absolute -right-24 bottom-0 w-72 rotate-180 stroke-[#fff2dc] stroke-[1.1] opacity-15 sm:w-96" />
        <div className="relative mx-auto max-w-xl">
          <p className="text-center font-serif text-sm">Antes del {RSVP_DEADLINE_LABEL}</p>
          <h2 className="mt-2 text-center font-script text-5xl">Confirma tu asistencia</h2>

          {!guest || !token ? (
            <div className="mt-10 border-y border-[#fff2dc]/65 py-10 text-center"><p className="font-serif text-lg">Esta invitación no es válida.</p></div>
          ) : submitted ? (
            <div className="mt-10 flex flex-col items-center border-y border-[#fff2dc]/65 py-10 text-center">
              <Check className="size-10 stroke-1" />
              <p className="mt-4 font-script text-4xl">Gracias por confirmar</p>
              <p className="mt-4 max-w-md font-serif text-lg leading-relaxed">Agradecemos contar contigo en nuestro día especial. Será una alegría celebrar este momento y crear recuerdos juntos.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6 border-t border-[#fff2dc]/65 pt-8">
              <p className="border-b border-[#fff2dc]/65 pb-4 text-center font-serif text-xl">{guest.family ? `Familia ${guest.name}` : `Sr. (Sra.) ${guest.name}`}</p>
              {isPreviouslyAnswered && <p className="border border-[#fff2dc]/65 px-4 py-3 text-center text-sm">Ya confirmaste o indicaste que no asistirás. Podrás cambiar de opinión hasta el {RSVP_DEADLINE_LABEL}.</p>}
              {!rsvpOpen && <p className="border border-[#fff2dc]/65 px-4 py-3 text-center text-sm">El plazo de confirmación finalizó el {RSVP_DEADLINE_LABEL}.</p>}

              <fieldset>
                <legend className="font-serif text-lg">¿Podrás acompañarnos?</legend>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendance("yes")}
                    disabled={!rsvpOpen}
                    className={`min-h-12 border font-serif text-lg transition-colors ${attendance === "yes" ? "bg-[#fff2dc] text-[#8d1012]" : "border-[#fff2dc]/65"}`}
                  >
                    Asistiré
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance("no")}
                    disabled={!rsvpOpen}
                    className={`min-h-12 border font-serif text-lg transition-colors ${attendance === "no" ? "bg-[#fff2dc] text-[#8d1012]" : "border-[#fff2dc]/65"}`}
                  >
                    No asistiré
                  </button>
                </div>
              </fieldset>

              <label className="block font-serif text-lg">
                Número de pases (máximo {guest.passes_number})
                <select value={passes} disabled={attendance !== "yes" || !rsvpOpen} onChange={(event) => setPasses(Number(event.target.value))} className="mt-2 min-h-12 w-full border-b border-[#fff2dc]/65 bg-[#8d1012] px-1 font-sans text-base outline-none disabled:cursor-not-allowed disabled:opacity-45 focus:border-[#fff2dc]">
                  {passOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>

              <label className="block font-serif text-lg">
                Comentarios
                <textarea value={observation} disabled={!rsvpOpen} onChange={(event) => setObservation(event.target.value)} rows={3} className="mt-2 w-full border border-[#fff2dc]/65 bg-transparent p-3 font-sans text-base outline-none disabled:cursor-not-allowed disabled:opacity-45 focus:border-[#fff2dc]" />
              </label>

              {error && <p className="text-center text-sm">{error}</p>}
              <button type="submit" disabled={!attendance || !rsvpOpen || isSubmitting} className="min-h-12 w-full bg-[#fff2dc] px-5 font-serif text-lg text-[#8d1012] transition-opacity disabled:cursor-not-allowed disabled:opacity-45">
                {isSubmitting ? "Guardando..." : isPreviouslyAnswered ? "Actualizar respuesta" : "Enviar confirmación"}
              </button>
            </form>
          )}
        </div>
        {showDeclinedModal && <div role="dialog" aria-modal="true" aria-labelledby="declined-modal-title" className="fixed inset-0 z-50 grid place-items-center bg-[#2b160f]/70 p-5 text-[#7b351f]"><div className="w-full max-w-lg bg-[#fff2dc] p-7 text-center shadow-2xl sm:p-9"><button type="button" onClick={() => setShowDeclinedModal(false)} aria-label="Cerrar mensaje" className="float-right -mt-2 -mr-2 inline-flex size-9 items-center justify-center border border-[#7b351f]/30"><X className="size-4" /></button><Check className="mx-auto size-9 stroke-1 text-[#a71e1b]" /><h3 id="declined-modal-title" className="mt-4 font-script text-4xl">Gracias por responder</h3><p className="mt-5 font-serif text-lg leading-relaxed">Lamentamos que no puedas acompañarnos presencialmente, pero podrás hacerlo de manera virtual a través de un enlace de YouTube que compartiremos.</p><p className="mt-4 text-sm leading-relaxed">Si cambias de opinión, estás a tiempo hasta el {RSVP_DEADLINE_LABEL}. También puedes comunicarte directamente con nosotros.</p><button type="button" onClick={() => setShowDeclinedModal(false)} className="mt-7 min-h-11 bg-[#8d1012] px-5 font-serif text-lg text-[#fff2dc]">Entendido</button></div></div>}
      </SectionReveal>
    );
}