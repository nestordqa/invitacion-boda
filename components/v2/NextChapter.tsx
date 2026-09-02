"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SparkleArrow } from "./decor/SparkleArrow";

type NextChapterProps = {
  guest: {
    name: string;
    family: boolean;
  } | null;
  onEnterInvitation: () => void;
};

// Placeholder de la sección que irá antes de la historia; solo el título con el invitado está definido.
export function NextChapter({ guest, onEnterInvitation }: NextChapterProps) {
  const title = guest ? (guest.family ? `${guest.name} y Flia.` : guest.name) : "Bienvenido";

  return (
    <section
      id="next-chapter"
      className="relative flex h-svh items-center justify-center overflow-hidden px-6 text-center"
    >
      <Image
        src="/v2/photos/church-3.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#21140f]/55" />
      <div className="pointer-events-none absolute inset-x-0 top-16 bottom-16 bg-[radial-gradient(ellipse_at_center,rgba(33,20,15,0.48)_0%,rgba(33,20,15,0.3)_48%,transparent_78%)]" />
      <div className="relative mt-12 flex flex-col items-center gap-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
        <h2 className="font-(family-name:--font-pinyon) text-5xl gold-foil-text sm:text-6xl">
          {title}
        </h2>
        <p className="max-w-sm font-(family-name:--font-montserrat) text-sm leading-6 text-[#FDFBF7]/85">
          Hay personas que dejan una huella <b>imborrable</b> en nuestra historia, y <b>tú eres una de esas personas</b>.<br></br>
          Gracias por haber sido parte fundamental del camino que nos trajo hasta aquí y por seguir caminando a nuestro lado en este nuevo capítulo.<br></br><br></br>
          Te agradecemos de corazón por cada consejo, cada abrazo y por estar presente en nuestros mejores momentos.<br></br><br></br>
          <b>¡Contar contigo hoy lo hace perfecto!</b>
        </p>
        <motion.button
          type="button"
          onClick={onEnterInvitation}
          whileHover={{ scale: 1.05 }}
          className="mt-24 flex flex-col items-center gap-2"
        >
          <span className="gold-foil-text font-(family-name:--font-montserrat) text-sm font-bold uppercase tracking-[0.14em]">
            Pulsa aquí
          </span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <SparkleArrow className="h-24 w-24" />
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
}

