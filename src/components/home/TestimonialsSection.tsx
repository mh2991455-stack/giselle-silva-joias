"use client";

import { useEffect, useRef } from "react";
import EmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Testimonial } from "@/types/database";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const [emblaRef] = EmblaCarousel({ loop: true, align: "start" }, [autoplay.current]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-[var(--color-dark)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="text-[var(--color-accent)] font-semibold text-sm tracking-widest uppercase mb-3">
            ✦ Quem ama a Giselle
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
            Depoimentos
          </h2>
        </ScrollReveal>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="flex-none w-80 sm:w-96">
                <GlassCard variant="dark" className="p-6 h-full">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                    ))}
                  </div>
                  <p className="text-white/80 leading-relaxed mb-6 text-sm italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <p className="font-semibold text-white">{t.name}</p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
