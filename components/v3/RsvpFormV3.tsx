"use client";

import { Check, Heart, HeartCrack } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Invitation } from "@/utils/invitation";
import type { Content } from "./content";

type RsvpFormV3Props = {
  t: Content;
  guest: Invitation | null;
  token?: string;
  deadlineLabel: string;
  rsvpOpen: boolean;
};

const card = "mx-auto mt-7 max-w-xl rounded-2xl border border-[#c9cdb8] bg-[#fffdf6]/80 shadow-[0_12px_40px_-24px_rgba(70,84,56,0.45)]";
const label = "mb-3 block font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#687653]";

export function RsvpFormV3({ t, guest, token, deadlineLabel, rsvpOpen }: RsvpFormV3Props) {
  const isPreviouslyAnswered = guest?.confirmation === "confirmed" || guest?.confirmation === "declined";
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(guest?.confirmation === "confirmed" ? "yes" : guest?.confirmation === "declined" ? "no" : null);
  const [passes, setPasses] = useState(guest?.confirmation === "confirmed" ? guest.used_passes_confirmed : guest?.passes_number || 1);
  const [observation, setObservation] = useState(guest?.guest_observation || "");
  const [submitted, setSubmitted] = useState<"yes" | "no" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        throw new Error(result.error || t.saveError);
      }
      setSubmitted(attendance);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!guest || !token) {
    return <div className={`${card} px-6 py-8`}><p className="font-sans text-sm text-[#465438]">{t.invalidInvitation}</p></div>;
  }

  if (submitted) {
    return (
      <div className={`${card} flex flex-col items-center px-6 py-10`}>
        <span className="flex size-14 items-center justify-center rounded-full bg-[#687653] text-[#fffdf6]"><Check className="size-7" /></span>
        <p className="mt-5 max-w-sm text-xl leading-snug">{submitted === "yes" ? t.thanksYes : t.thanksNo}</p>
      </div>
    );
  }

  const guestName = guest.family ? t.family(guest.name) : guest.name;

  return (
    <form onSubmit={handleSubmit} className={`${card} overflow-hidden text-left`}>
      <div className="border-b border-[#c9cdb8]/70 bg-[#edf0e5]/70 px-6 py-6 text-center sm:px-8">
        <p className="font-(family-name:--font-script) text-4xl leading-tight text-[#465438]">{t.hello(guestName)}</p>
        <p className="mt-2 font-sans text-sm text-[#5d5a4f]">{t.rsvpDeadline(deadlineLabel)}</p>
        {isPreviouslyAnswered && rsvpOpen && <p className="mt-3 font-sans text-xs text-[#687653]">{t.previouslyAnswered(deadlineLabel)}</p>}
        {!rsvpOpen && <p className="mt-3 font-sans text-xs font-semibold text-[#9c3b3b]">{t.closed(deadlineLabel)}</p>}
      </div>

      <div className="space-y-7 px-6 py-7 sm:px-8">
        <fieldset>
          <legend className={label}>{t.attendQuestion}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {([["yes", t.yes, Heart], ["no", t.no, HeartCrack]] as const).map(([value, text, Icon]) => {
              const isSelected = attendance === value;
              return (
                <button key={value} type="button" disabled={!rsvpOpen} aria-pressed={isSelected} onClick={() => setAttendance(value)} className={`flex min-h-16 items-center gap-3 rounded-xl border px-4 py-3 text-left text-lg leading-snug transition-all disabled:cursor-not-allowed disabled:opacity-50 ${isSelected ? "border-[#687653] bg-[#687653] text-[#fffdf6] shadow-md" : "border-[#c9cdb8] bg-[#fffefa] text-[#342f29] hover:border-[#687653]"}`}>
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${isSelected ? "bg-[#fffdf6]/20" : "bg-[#687653]/10 text-[#687653]"}`}>
                    <Icon className={`size-4 ${value === "yes" && isSelected ? "fill-current" : ""}`} />
                  </span>
                  {text}
                </button>
              );
            })}
          </div>
        </fieldset>

        {attendance === "yes" && guest.passes_number > 1 && (
          <fieldset>
            <legend className={label}>{t.passes(guest.passes_number)}</legend>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: guest.passes_number }, (_, index) => index + 1).map((value) => (
                <button key={value} type="button" disabled={!rsvpOpen} aria-pressed={passes === value} onClick={() => setPasses(value)} className={`min-h-11 min-w-11 rounded-full border px-4 font-sans text-sm font-semibold transition-colors ${passes === value ? "border-[#687653] bg-[#687653] text-[#fffdf6]" : "border-[#c9cdb8] bg-[#fffefa] text-[#465438] hover:border-[#687653]"}`}>
                  {value}
                </button>
              ))}
            </div>
            <p className="mt-2 font-sans text-xs text-[#6d6b5d]">{t.person(passes)}</p>
          </fieldset>
        )}

        <label className="block">
          <span className={label}>{t.observation}</span>
          <textarea value={observation} disabled={!rsvpOpen} onChange={(event) => setObservation(event.target.value)} rows={4} placeholder={t.observationPlaceholder} className="min-h-28 w-full resize-y rounded-xl border border-[#c9cdb8] bg-[#fffefa] p-4 text-lg text-[#342f29] transition-colors outline-none placeholder:text-[#342f29]/40 focus:border-[#687653] focus:ring-3 focus:ring-[#687653]/15 disabled:opacity-50" />
        </label>

        {error && <p role="alert" className="rounded-xl bg-[#f6dfd8] px-4 py-3 font-sans text-sm text-[#8d3024]">{error}</p>}

        <button type="submit" disabled={!attendance || !rsvpOpen || isSubmitting} className="inline-flex min-h-13 w-full items-center justify-center rounded-full bg-[#687653] px-6 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#fffdf6] shadow-md transition-colors hover:bg-[#465438] disabled:cursor-not-allowed disabled:bg-[#687653]/40 disabled:shadow-none">
          {isSubmitting ? t.saving : isPreviouslyAnswered ? t.update : t.submit}
        </button>
      </div>
    </form>
  );
}
