"use client";

import { motion } from "framer-motion";
import { LaceFiligree } from "./decor/LaceFiligree";

export function Story() {
  return (
    <section id="story" className="relative overflow-hidden bg-[#FDFBF7] px-7 py-16 text-center sm:px-10">
      <LaceFiligree className="pointer-events-none absolute -left-10 -top-10 w-40 text-[#D4AF37]/40 sm:w-52" />
      <LaceFiligree className="pointer-events-none absolute -right-10 -bottom-10 w-40 rotate-180 text-[#D4AF37]/40 sm:w-52" />
      <motion.div
        className="relative mx-auto max-w-md"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="font-(family-name:--font-montserrat) text-lg leading-7 text-[#333333]">
          Queremos celebrar junto a nuestros seres queridos la unión de nuestras vidas en matrimonio.
          Acompáñanos en este día tan especial, donde compartiremos risas, lágrimas de felicidad
          y momentos inolvidables. Tu presencia será el mejor regalo en esta nueva aventura que comenzamos juntos.
        </p>
      </motion.div>
    </section>
  );
}
