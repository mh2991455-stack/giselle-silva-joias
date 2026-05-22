"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { SiteSettings } from "@/types/database";

interface HeroSectionProps {
  settings: SiteSettings | null;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const title = settings?.hero_title ?? "Joias que contam a sua história";
  const subtitle = settings?.hero_subtitle ?? "Semijoias banhadas com qualidade e estilo. Atendimento direto com a Giselle.";

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background with parallax */}
      <motion.div
        className="absolute inset-0 gradient-hero"
        style={{ y: bgY }}
      />

      {/* Overlay pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />

      {/* Floating decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm font-medium mb-6"
        >
          ✦ Joias & Semijoias Banhadas
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            as="a"
            href="/catalogo"
            className="px-8 py-4 rounded-2xl bg-white text-[var(--color-primary)] font-bold text-lg hover:bg-[var(--color-light)] transition-colors shadow-2xl gap-2"
          >
            Ver catálogo <ArrowRight className="w-5 h-5" />
          </MagneticButton>

          <MagneticButton
            as="a"
            href="https://wa.me/5531997969787"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors shadow-xl gap-2"
          >
            <MessageCircle className="w-5 h-5" /> Falar com a Giselle
          </MagneticButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-8 mt-16 text-white"
        >
          {[
            { value: "72+", label: "Peças" },
            { value: "3x", label: "Sem juros" },
            { value: "100%", label: "Garantia" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  );
}
