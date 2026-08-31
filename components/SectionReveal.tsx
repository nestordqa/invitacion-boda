"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionRevealProps = { children: ReactNode; className?: string };

export function SectionReveal({ children, className = "" }: SectionRevealProps) {
  return <motion.section className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.6, ease: "easeOut" }}>{children}</motion.section>;
}