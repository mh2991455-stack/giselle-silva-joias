"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { SiteSettings } from "@/types/database";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=1920&q=85&auto=format&fit=crop";

interface HeroSectionProps {
  settings: SiteSettings | null;
}

const words = ["história", "estilo", "essência", "beleza"];

export function HeroSection({ settings }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const title = settings?.hero_title ?? "Joias que contam a sua história";
  const subtitle = settings?.hero_subtitle ?? "Semijoias banhadas com qualidade e estilo. Atendimento direto com a Giselle.";

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Photo background with parallax */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y: bgY }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
      </motion.div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(10,5,25,0.72) 0%, rgba(26,10,40,0.55) 50%, rgba(10,5,25,0.75) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48"
        style={{ background: "linear-gradient(to top, rgba(255,248,240,1) 0%, transparent 100%)" }}
      />

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[var(--color-accent)]/60"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-12, 12, -12],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
        style={{ y: textY, opacity }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white/90 text-sm font-medium mb-8 tracking-wide"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Joias & Semijoias Banhadas
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            </span>
          </motion.div>

          {/* Glass text card */}
          <motion.div
            variants={itemVariants}
            className="relative px-8 sm:px-14 py-10 sm:py-14 rounded-3xl mb-10"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            {/* Glass reflection */}
            <div className="absolute top-0 left-8 right-8 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
            />

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.08] tracking-tight"
              style={{ textShadow: "0 2px 40px rgba(255,182,39,0.3), 0 0 80px rgba(255,0,110,0.15)" }}
            >
              {title}
            </h1>

            <p className="text-lg sm:text-xl text-white/75 max-w-xl mx-auto mt-6 leading-relaxed"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
            >
              {subtitle}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              as="a"
              href="/catalogo"
              className="px-8 py-4 rounded-2xl font-bold text-lg gap-2 text-[var(--color-dark)] hover:opacity-90 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #fff 0%, rgba(255,248,240,0.95) 100%)",
                boxShadow: "0 8px 32px rgba(255,0,110,0.25), 0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              Ver catálogo <ArrowRight className="w-5 h-5" />
            </MagneticButton>

            <MagneticButton
              as="a"
              href="https://wa.me/5531997969787"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 gap-2 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                boxShadow: "0 8px 32px rgba(34,197,94,0.35), 0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <MessageCircle className="w-5 h-5" /> Falar com a Giselle
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-10 mt-14">
            {[
              { value: "72+", label: "Peças" },
              { value: "3x", label: "Sem juros" },
              { value: "100%", label: "Garantia" },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center relative">
                {i > 0 && (
                  <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-px h-8 bg-white/20" />
                )}
                <p className="text-3xl font-bold text-white"
                  style={{ textShadow: "0 0 20px rgba(255,182,39,0.5)" }}
                >
                  {stat.value}
                </p>
                <p className="text-white/55 text-xs mt-1 tracking-widest uppercase">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
          style={{
            border: "2px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  );
}
