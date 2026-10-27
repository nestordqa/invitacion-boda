"use client";

import { BedDouble, Check, Church, Copy, Gift, MailOpen, MapPin, MessageCircleHeart, Plus, Wine } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { Invitation } from "@/utils/invitation";
import { DressIcon, FallingPetals, FloralCluster, HeartDivider, Sprig } from "./Botanical";
import { CEREMONY_MAP_URL, GIFT_ACCOUNTS, HOTELS, RECEPTION_MAP_URL, content, type Lang } from "./content";
import { RsvpFormV3 } from "./RsvpFormV3";

type InvitationV3Props = {
  guest: Invitation | null;
  token?: string;
  rsvpDeadline: string;
  rsvpOpen: boolean;
};

const formatDeadline = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(iso));

const heroStagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };

// Aparece suavemente al entrar en pantalla.
function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} className={className}>{children}</motion.div>;
}

function Section({ id, eyebrow, title, children, className = "" }: { id: string; eyebrow?: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative isolate scroll-mt-6 border-t border-[#c9cdb8] px-5 py-14 text-center sm:px-6 sm:py-16 ${className}`}>
      <Sprig className="pointer-events-none absolute top-[12%] left-0 -z-10 h-32 w-6 text-[#687653] opacity-35 sm:left-1 sm:h-48 sm:w-14 sm:opacity-50" />
      <Sprig className="pointer-events-none absolute top-[12%] right-0 -z-10 h-32 w-6 -scale-x-100 text-[#687653] opacity-35 sm:right-1 sm:h-48 sm:w-14 sm:opacity-50" />
      <Reveal>
        {eyebrow && <p className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#687653]">{eyebrow}</p>}
        <h2 className="mt-2.5 mb-4 font-(family-name:--font-script) text-[2.6rem] leading-tight text-[#465438] sm:text-6xl">{title}</h2>
        {children}
      </Reveal>
    </section>
  );
}

function MapButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#687653] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#465438] transition-colors hover:bg-[#687653] hover:text-[#fffdf6]">
      <MapPin className="size-3.5" />{label}
    </a>
  );
}

export function InvitationV3({ guest, token, rsvpDeadline, rsvpOpen }: InvitationV3Props) {
  const [lang, setLang] = useState<Lang>("es");
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const t = content[lang];

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 1800);
  }

  const navItems = [
    { href: "#ceremonia", label: t.nav.ceremony, icon: Church },
    { href: "#celebracion", label: t.nav.reception, icon: Wine },
    { href: "#vestimenta", label: t.nav.dress, icon: DressIcon },
    { href: "#alojamiento", label: t.nav.hotels, icon: BedDouble },
    { href: "#regalos", label: t.nav.gifts, icon: Gift },
    { href: "#preguntas", label: t.nav.faq, icon: MessageCircleHeart },
    { href: "#rsvp", label: t.nav.rsvp, icon: MailOpen },
  ];

  return (
    <div lang={lang === "es" ? "es" : "en"} className="min-h-screen scroll-smooth bg-[#f8f4e8] font-(family-name:--font-playfair) text-[#342f29]">
      <button type="button" onClick={() => setLang(lang === "es" ? "en" : "es")} aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"} className="fixed top-3.5 right-3.5 z-50 rounded-full border border-[#687653] bg-[#f8f4e8]/95 px-3.5 py-2 font-sans text-xs font-bold tracking-[0.08em] text-[#465438] shadow-sm">
        {lang === "es" ? "EN" : "ES"}
      </button>

      <main className="mx-auto max-w-3xl overflow-hidden">
        <motion.section initial="hidden" animate="visible" variants={heroStagger} className="relative isolate flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-5 pt-16 pb-11 text-center sm:min-h-[95vh] sm:pt-8">
          <FallingPetals />
          <div className="pointer-events-none absolute -top-4 -left-6 -z-10 w-32 -scale-y-100 sm:w-48"><div className="v3-sway"><FloralCluster /></div></div>
          <div className="pointer-events-none absolute -top-4 -right-6 -z-10 w-32 -scale-100 sm:w-48"><div className="v3-sway"><FloralCluster /></div></div>
          <div className="pointer-events-none absolute -bottom-2 -left-6 -z-10 w-28 sm:w-44"><div className="v3-sway"><FloralCluster /></div></div>
          <div className="pointer-events-none absolute -right-6 -bottom-2 -z-10 w-28 -scale-x-100 sm:w-44"><div className="v3-sway"><FloralCluster /></div></div>
          <motion.p variants={fadeUp} className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#687653]">{t.eyebrow}</motion.p>
          <motion.h1 variants={fadeUp} className="mt-4 mb-2 font-(family-name:--font-script) text-6xl leading-[0.95] text-[#465438] sm:text-8xl">Gabriel <span className="block sm:inline">&amp; Vanessa</span></motion.h1>
          <motion.p variants={fadeUp} className="font-(family-name:--font-script) text-3xl text-[#687653] sm:text-4xl">{t.ourWedding}</motion.p>
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } } }} className="v3-float w-full"><Image src="/v3/hero-couple.jpg" alt="Ilustración de Gabriel y Vanessa con sus perritos Benito y Nala" width={666} height={820} priority className="mx-auto my-4 h-auto w-full max-w-md mix-blend-multiply" /></motion.div>
          <motion.div variants={fadeUp}>
            <p className="font-sans text-[13px] uppercase tracking-[0.18em] text-[#465438]">{t.date}</p>
            <HeartDivider className="my-3" />
            <p className="mx-auto max-w-sm text-xl leading-snug text-[#5d5a4f]">{t.tagline}</p>
          </motion.div>
          <motion.a variants={fadeUp} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} href="#ceremonia" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#687653] px-7 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#fffdf6] shadow-md transition-colors hover:bg-[#465438]">{t.open} <span className="inline-block animate-bounce">↓</span></motion.a>
        </motion.section>

        <nav aria-label={lang === "es" ? "Secciones de la invitación" : "Invitation sections"} className="flex flex-wrap justify-center gap-y-6 border-t border-[#c9cdb8] px-2 py-9 sm:px-4">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="group flex w-1/4 flex-col items-center gap-2.5 px-1 text-center sm:w-1/7">
              <span className="flex size-14 items-center justify-center rounded-full border border-[#c9cdb8] bg-[#fffdf6] text-[#687653] transition-colors group-hover:border-[#687653] group-hover:bg-[#687653] group-hover:text-[#fffdf6]">
                <item.icon className="size-6 stroke-[1.25]" />
              </span>
              <span className="font-sans text-[9px] font-bold uppercase leading-snug tracking-widest text-[#465438] sm:text-[10px]">{item.label}</span>
            </a>
          ))}
        </nav>

        <section className="grid border-t border-[#c9cdb8] sm:grid-cols-2 sm:divide-x sm:divide-[#c9cdb8]">
          {[
            { id: "ceremonia", title: t.ceremonyTitle, image: "/v3/church.webp", width: 340, height: 230, place: t.ceremonyPlace, detail: t.ceremonyDetail, time: t.ceremonyTime, map: CEREMONY_MAP_URL },
            { id: "celebracion", title: t.receptionTitle, image: "/v3/restaurant.webp", width: 465, height: 215, place: t.receptionPlace, detail: t.receptionDetail, time: t.receptionTime, map: RECEPTION_MAP_URL },
          ].map((event) => (
            <article key={event.id} id={event.id} className="scroll-mt-6 border-b border-[#c9cdb8] px-6 py-12 text-center last:border-b-0 sm:border-b-0">
              <h2 className="font-(family-name:--font-script) text-5xl text-[#465438]">{event.title}</h2>
              <Image src={event.image} alt="" width={event.width} height={event.height} className="mx-auto mt-4 h-40 w-auto object-contain mix-blend-multiply" />
              <h3 className="mt-4 font-sans text-[13px] font-bold uppercase tracking-[0.15em] text-[#465438]">{event.place}</h3>
              <p className="mt-1 text-lg text-[#5d5a4f]">{event.detail}</p>
              <p className="mt-1 text-xl font-semibold text-[#342f29]">{event.time}</p>
              <MapButton href={event.map} label={t.map} />
            </article>
          ))}
        </section>

        <section id="familias" className="border-t border-[#c9cdb8] px-3 pt-12 pb-14 text-center sm:px-6">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#687653]">{t.familiesEyebrow}</p>
          <h2 className="mt-2.5 font-(family-name:--font-script) text-[2.6rem] leading-tight text-[#465438] sm:text-6xl">{t.familiesTitle}</h2>
          <Image src="/v3/family-dogs.jpg" alt="Benito, nuestro schnauzer negro, y Nala, nuestra golden doodle dorada" width={2170} height={725} className="mx-auto mt-1 mb-2 h-auto w-full mix-blend-multiply" />
          <div className="mx-auto max-w-xl space-y-3 text-lg leading-relaxed sm:text-xl">
            {t.familiesText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="italic">{t.familiesClosing}</p>
          </div>
        </section>

        <Section id="vestimenta" eyebrow={t.dressEyebrow} title={t.dressTitle}>
          <Image src="/v3/dancing.webp" alt="Ilustración de Gabriel y Vanessa bailando" width={722} height={760} className="mx-auto mt-2 mb-5 h-auto max-h-80 w-auto mix-blend-multiply" />
          <p className="text-2xl font-semibold text-[#465438]">{t.dressCode}</p>
          <p className="mx-auto mt-3 max-w-lg text-xl leading-relaxed">{t.dressText}</p>
        </Section>

        <Section id="alojamiento" eyebrow={t.hotelsEyebrow} title={t.hotelsTitle}>
          <p className="mx-auto max-w-lg text-xl leading-relaxed">{t.hotelsText}</p>
          <ul className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            {HOTELS.map((hotel) => (
              <li key={hotel.name} className="border border-[#c9cdb8] bg-[#fffdf6]/60 px-3 py-4">
                <p className="text-lg font-semibold text-[#465438]">{hotel.name}</p>
                <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.1em] text-[#6d6b5d]">{t.code}</p>
                <button type="button" onClick={() => void copy(hotel.code)} className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded bg-[#687653]/10 px-2 py-1 font-mono text-[13px] whitespace-nowrap text-[#342f29]">
                  {hotel.code}{copiedValue === hotel.code ? <Check className="size-3.5 shrink-0" /> : <Copy className="size-3.5 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-5 max-w-md font-sans text-xs leading-relaxed text-[#6d6b5d]">{t.hotelsNote}</p>
        </Section>

        <Section id="regalos" eyebrow={t.giftsEyebrow} title={t.giftsTitle}>
          <Image src="/v3/gift.webp" alt="" width={160} height={195} className="mx-auto mb-3 h-32 w-auto mix-blend-multiply" />
          <p className="mx-auto max-w-lg text-xl leading-relaxed">{t.giftsText}</p>
          <div className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
            {GIFT_ACCOUNTS.map((account) => (
              <div key={account.label} className="flex flex-col items-center border border-[#c9cdb8] bg-[#fffdf6]/60 px-3 py-4">
                <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-[#465438]">{account.label}</h3>
                <p className="mt-2 font-mono text-sm break-words">{account.value}</p>
                {account.holder && <p className="text-base text-[#5d5a4f]">{account.holder}</p>}
                <button type="button" onClick={() => void copy(account.value)} className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-[#687653] hover:text-[#465438]">
                  {copiedValue === account.value ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copiedValue === account.value ? t.copied : t.copy}
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section id="preguntas" eyebrow={t.faqEyebrow} title={t.faqTitle}>
          <div className="mx-auto mt-6 max-w-xl divide-y divide-[#c9cdb8]/70 rounded-2xl border border-[#c9cdb8] bg-[#fffdf6]/70 px-5 text-left shadow-[0_12px_40px_-24px_rgba(70,84,56,0.45)] sm:px-7">
            {t.faq.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.q}>
                  <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={`faq-${index}`} className="group flex w-full items-center justify-between gap-4 py-5 text-left">
                    <span className={`text-lg leading-snug transition-colors sm:text-xl ${isOpen ? "text-[#465438]" : "text-[#342f29] group-hover:text-[#465438]"}`}>{item.q}</span>
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "rotate-45 border-[#687653] bg-[#687653] text-[#fffdf6]" : "border-[#c9cdb8] text-[#687653] group-hover:border-[#687653]"}`}>
                      <Plus className="size-4" />
                    </span>
                  </button>
                  <div id={`faq-${index}`} className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="pb-5 font-sans text-sm leading-relaxed text-[#5d5a4f]">
                        {item.a}
                        {"map" in item && item.map && <a href={item.map} target="_blank" rel="noopener noreferrer" className="mt-2 flex w-fit items-center gap-1.5 font-semibold text-[#687653] hover:text-[#465438]"><MapPin className="size-3.5" />{t.openMap}</a>}
                      </p>
                      {"dog" in item && item.dog && <Image src="/v3/benito.webp" alt="Benito, nuestro perrito" width={160} height={120} className="mx-auto mb-5 h-24 w-auto mix-blend-multiply" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="rsvp" eyebrow={t.rsvpEyebrow} title={t.rsvpTitle}>
          <RsvpFormV3 t={t} guest={guest} token={token} deadlineLabel={formatDeadline(rsvpDeadline, lang)} rsvpOpen={rsvpOpen} />
        </Section>

        <footer className="bg-[#465438] px-5 py-11 text-center text-[#f8f4e8]">
          <HeartDivider className="text-[#f8f4e8]!" />
          <h2 className="mt-2 font-(family-name:--font-script) text-4xl">Gabriel &amp; Vanessa</h2>
          <p className="mt-2 font-sans text-xs uppercase tracking-[0.12em]">{t.date}</p>
          <p className="mt-2 font-sans text-xs tracking-[0.06em]">{t.footer}</p>
        </footer>
      </main>
    </div>
  );
}
