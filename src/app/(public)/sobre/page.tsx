import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/supabase/queries";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história da Giselle Silva e a paixão por joias e semijoias que deu origem à marca.",
};

export const revalidate = 3600;

export default async function SobrePage() {
  const settings = await getSiteSettings();
  const about = settings?.about_giselle ?? "Apaixonada por joias desde sempre, a Giselle criou sua marca para levar beleza e sofisticação para o dia a dia de todas as mulheres. Cada peça é escolhida com carinho e cuidado para que você se sinta especial em qualquer momento.\n\nCom anos de experiência no mercado de semijoias, a Giselle se especializou em oferecer peças de alta qualidade com banho duradouro, garantindo que cada cliente fique satisfeita com sua compra.";

  return (
    <div className="pt-24 pb-20 bg-[var(--color-light)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <ScrollReveal className="text-center py-16">
          <p className="text-[var(--color-primary)] font-semibold text-sm tracking-widest uppercase mb-4">✦ Nossa história</p>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[var(--color-dark)] mb-6">Sobre a Giselle</h1>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
        </ScrollReveal>

        {/* Bio */}
        <ScrollReveal delay={0.15}>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
            {about.split("\n\n").map((para, i) => (
              <p key={i} className="mb-6 text-lg">{para}</p>
            ))}
          </div>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal delay={0.3} className="mt-16 grid sm:grid-cols-3 gap-6">
          {[
            { title: "Qualidade", desc: "Peças com banho de alta durabilidade, selecionadas com cuidado." },
            { title: "Estilo", desc: "Tendências que valorizam a beleza de cada mulher." },
            { title: "Confiança", desc: "Atendimento direto e personalizado em cada compra." },
          ].map((v) => (
            <div key={v.title} className="p-6 rounded-2xl bg-white shadow-[var(--shadow-card)] text-center">
              <h3 className="text-xl font-bold text-[var(--color-dark)] mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm">{v.desc}</p>
            </div>
          ))}
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.4} className="text-center mt-16">
          <p className="text-gray-500 mb-6">Tem alguma dúvida? Fale diretamente com a Giselle!</p>
          <a
            href="https://wa.me/5531997969787"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors shadow-lg"
          >
            <MessageCircle className="w-5 h-5" /> Falar com a Giselle
          </a>
        </ScrollReveal>
      </div>
    </div>
  );
}
