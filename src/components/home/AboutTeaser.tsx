import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Heart } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { SiteSettings } from "@/types/database";

const VALUES = [
  { icon: Sparkles, title: "Qualidade Premium", desc: "Banho de alta durabilidade. Peças feitas para durar." },
  { icon: Shield, title: "Garantia de Satisfação", desc: "Seu dinheiro de volta se não ficar satisfeita." },
  { icon: Heart, title: "Atendimento Personalizado", desc: "A Giselle cuida de cada pedido com carinho." },
];

export function AboutTeaser({ settings }: { settings: SiteSettings | null }) {
  const about = settings?.about_giselle ?? "Apaixonada por joias desde sempre, a Giselle criou sua marca para levar beleza e sofisticação para o dia a dia de todas as mulheres. Cada peça é escolhida com carinho e cuidado para que você se sinta especial.";

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <ScrollReveal direction="left">
          <p className="text-[var(--color-primary)] font-semibold text-sm tracking-widest uppercase mb-4">
            ✦ Sobre a Giselle
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-dark)] leading-tight mb-6">
            Joias com alma,<br />
            <span className="gradient-text">feitas com amor</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-lg">{about}</p>
          <Link
            href="/sobre"
            className="inline-flex items-center gap-2 font-semibold text-[var(--color-primary)] hover:gap-4 transition-all duration-300"
          >
            Conheça a história <ArrowRight className="w-5 h-5" />
          </Link>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal direction="right" delay={0.2}>
          <div className="space-y-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-dark)] mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
