"use client";

import { Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { FloralCorner } from "./FloralCorner";
import { SectionReveal } from "./SectionReveal";

export function RsvpForm() {
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);
  const [submitted, setSubmitted] = useState(false);
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setSubmitted(true);
    }
    return (
      <SectionReveal className="relative overflow-hidden bg-[#8d1012] px-5 py-16 text-[#fff2dc] sm:px-10">
        <FloralCorner className="pointer-events-none absolute -left-24 top-4 w-72 -rotate-12 stroke-[#fff2dc] stroke-[1.1] opacity-15 sm:w-96" />
        <FloralCorner className="pointer-events-none absolute -right-24 bottom-0 w-72 rotate-180 stroke-[#fff2dc] stroke-[1.1] opacity-15 sm:w-96" />
        <div className="relative mx-auto max-w-xl">
          <p className="text-center font-serif text-sm">Antes del 30 de septiembre</p>
          <h2 className="mt-2 text-center font-script text-5xl">Confirma tu asistencia</h2>

          {submitted ? (
            <div className="mt-10 flex flex-col items-center border-y border-[#fff2dc]/65 py-10 text-center">
              <Check className="size-10 stroke-1" />
              <p className="mt-4 font-script text-4xl">Gracias por responder</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6 border-t border-[#fff2dc]/65 pt-8">
              <label className="block font-serif text-lg">
                Nombre completo
                <input
                  required
                  name="name"
                  className="mt-2 min-h-12 w-full border-b border-[#fff2dc]/65 bg-transparent px-1 text-base font-sans outline-none placeholder:text-[#fff2dc]/50 focus:border-[#fff2dc]"
                />
              </label>

              <fieldset>
                <legend className="font-serif text-lg">¿Podrás acompañarnos?</legend>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendance("yes")}
                    className={`min-h-12 border font-serif text-lg transition-colors ${attendance === "yes" ? "bg-[#fff2dc] text-[#8d1012]" : "border-[#fff2dc]/65"}`}
                  >
                    Asistiré
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance("no")}
                    className={`min-h-12 border font-serif text-lg transition-colors ${attendance === "no" ? "bg-[#fff2dc] text-[#8d1012]" : "border-[#fff2dc]/65"}`}
                  >
                    No asistiré
                  </button>
                </div>
              </fieldset>

              <label className="block font-serif text-lg">
                Número de pases
                <select name="guests" defaultValue="1" className="mt-2 min-h-12 w-full border-b border-[#fff2dc]/65 bg-[#8d1012] px-1 font-sans text-base outline-none focus:border-[#fff2dc]">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </label>

              <label className="block font-serif text-lg">
                Comentarios
                <textarea name="comments" rows={3} className="mt-2 w-full border border-[#fff2dc]/65 bg-transparent p-3 font-sans text-base outline-none focus:border-[#fff2dc]" />
              </label>

              <button type="submit" disabled={!attendance} className="min-h-12 w-full bg-[#fff2dc] px-5 font-serif text-lg text-[#8d1012] transition-opacity disabled:cursor-not-allowed disabled:opacity-45">
                Enviar confirmación
              </button>
            </form>
          )}
        </div>
      </SectionReveal>
    );
}