"use client";

import { Check, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { RSVP_DEADLINE_LABEL, isRsvpOpen } from "@/utils/wedding";
import { CarnationDivider } from "./decor/CarnationDivider";
import { LaceFiligree } from "./decor/LaceFiligree";

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
    <section className="relative overflow-hidden bg-[#FDFBF7] px-5 py-16 sm:px-10">
      <LaceFiligree className="pointer-events-none absolute -left-10 top-6 w-44 text-[#D4AF37]/40 sm:w-56" />
      <LaceFiligree className="pointer-events-none absolute -right-10 bottom-6 w-44 rotate-180 text-[#D4AF37]/40 sm:w-56" />
      <div className="relative mx-auto max-w-xl">
        <p className="text-center font-(family-name:--font-montserrat) text-sm text-[#333333]">Antes del {RSVP_DEADLINE_LABEL}</p>
        <h2 className="mt-2 text-center font-(family-name:--font-pinyon) text-5xl text-[#6B1D2F]">Confirma tu asistencia</h2>
        <CarnationDivider className="mt-4" />

        {!guest || !token ? (
          <div className="mt-10 border-y border-[#D4AF37]/40 py-10 text-center"><p className="font-(family-name:--font-montserrat) text-lg text-[#333333]">Esta invitación no es válida.</p></div>
        ) : submitted ? (
          <div className="mt-10 flex flex-col items-center border-y border-[#D4AF37]/40 py-10 text-center">
            <Check className="size-10 stroke-1 text-[#6B1D2F]" />
            <p className="mt-4 font-(family-name:--font-pinyon) text-4xl text-[#6B1D2F]">Gracias por confirmar</p>
            <p className="mt-4 max-w-md font-(family-name:--font-montserrat) text-lg leading-relaxed text-[#333333]">Agradecemos contar contigo en nuestro día especial. Será una alegría celebrar este momento y crear recuerdos juntos.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-6 border-t border-[#D4AF37]/40 pt-8">
            <p className="border-b border-[#D4AF37]/40 pb-4 text-center font-(family-name:--font-montserrat) text-xl text-[#333333]">{guest.family ? `${guest.name} y Flia.` : `${guest.name}`}</p>
            {isPreviouslyAnswered && <p className="border border-[#D4AF37]/40 px-4 py-3 text-center text-sm text-[#333333]">Ya confirmaste o indicaste que no asistirás. Podrás cambiar de opinión hasta el {RSVP_DEADLINE_LABEL}.</p>}
            {!rsvpOpen && <p className="border border-[#D4AF37]/40 px-4 py-3 text-center text-sm text-[#333333]">El plazo de confirmación finalizó el {RSVP_DEADLINE_LABEL}.</p>}

            <fieldset>
              <legend className="font-(family-name:--font-montserrat) text-lg text-[#333333]">¿Podrás acompañarnos?</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance("yes")}
                  disabled={!rsvpOpen}
                  className={`min-h-12 border font-(family-name:--font-montserrat) text-lg transition-colors ${attendance === "yes" ? "bg-[#6B1D2F] text-[#FDFBF7]" : "border-[#D4AF37] text-[#6B1D2F]"}`}
                >
                  Asistiré
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance("no")}
                  disabled={!rsvpOpen}
                  className={`min-h-12 border font-(family-name:--font-montserrat) text-lg transition-colors ${attendance === "no" ? "bg-[#6B1D2F] text-[#FDFBF7]" : "border-[#D4AF37] text-[#6B1D2F]"}`}
                >
                  No asistiré
                </button>
              </div>
            </fieldset>

            <label className="block font-(family-name:--font-montserrat) text-lg text-[#333333]">
              Número de pases (máximo {guest.passes_number})
              <select value={passes} disabled={attendance !== "yes" || !rsvpOpen} onChange={(event) => setPasses(Number(event.target.value))} className="mt-2 min-h-12 w-full border-b border-[#D4AF37]/60 bg-[#FDFBF7] px-1 text-base outline-none disabled:cursor-not-allowed disabled:opacity-45 focus:border-[#6B1D2F]">
                {passOptions.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>

            <label className="block font-(family-name:--font-montserrat) text-lg text-[#333333]">
              Comentarios
              <textarea value={observation} disabled={!rsvpOpen} onChange={(event) => setObservation(event.target.value)} rows={3} className="mt-2 w-full border border-[#D4AF37]/60 bg-transparent p-3 text-base outline-none disabled:cursor-not-allowed disabled:opacity-45 focus:border-[#6B1D2F]" />
            </label>

            {error && <p className="text-center text-sm text-[#6B1D2F]">{error}</p>}
            <button type="submit" disabled={!attendance || !rsvpOpen || isSubmitting} className="min-h-12 w-full bg-[#6B1D2F] px-5 font-(family-name:--font-montserrat) text-lg text-[#FDFBF7] transition-opacity disabled:cursor-not-allowed disabled:opacity-45">
              {isSubmitting ? "Guardando..." : isPreviouslyAnswered ? "Actualizar respuesta" : "Enviar confirmación"}
            </button>
          </form>
        )}
      </div>
      {showDeclinedModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="declined-modal-title" className="fixed inset-0 z-50 grid place-items-center bg-[#333333]/60 p-5">
          <div className="w-full max-w-lg bg-[#FDFBF7] p-7 text-center shadow-2xl sm:p-9">
            <button type="button" onClick={() => setShowDeclinedModal(false)} aria-label="Cerrar mensaje" className="float-right -mt-2 -mr-2 inline-flex size-9 items-center justify-center border border-[#6B1D2F]/30 text-[#6B1D2F]"><X className="size-4" /></button>
            <Check className="mx-auto size-9 stroke-1 text-[#6B1D2F]" />
            <h3 id="declined-modal-title" className="mt-4 font-(family-name:--font-pinyon) text-4xl text-[#6B1D2F]">Gracias por responder</h3>
            <p className="mt-5 font-(family-name:--font-montserrat) text-lg leading-relaxed text-[#333333]">Lamentamos que no puedas acompañarnos presencialmente, pero podrás hacerlo de manera virtual a través de un enlace de YouTube que compartiremos.</p>
            <p className="mt-4 text-sm leading-relaxed text-[#333333]">Si cambias de opinión, estás a tiempo hasta el {RSVP_DEADLINE_LABEL}. También puedes comunicarte directamente con nosotros.</p>
            <button type="button" onClick={() => setShowDeclinedModal(false)} className="mt-7 min-h-11 bg-[#6B1D2F] px-5 font-(family-name:--font-montserrat) text-lg text-[#FDFBF7]">Entendido</button>
          </div>
        </div>
      )}
    </section>
  );
}
