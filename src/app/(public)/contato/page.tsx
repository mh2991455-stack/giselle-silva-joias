import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a Giselle Silva. Atendimento pelo WhatsApp, Instagram e e-mail.",
};

export default function ContatoPage() {
  return (
    <div className="pt-24 pb-20 bg-[var(--color-light)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center py-12">
          <p className="text-[var(--color-primary)] font-semibold text-sm tracking-widest uppercase mb-4">✦ Fale com a gente</p>
          <h1 className="text-5xl font-extrabold text-[var(--color-dark)] mb-4">Contato</h1>
          <p className="text-gray-500 text-lg">A Giselle responde rapidinho no WhatsApp!</p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: MessageCircle,
              title: "WhatsApp",
              desc: "A forma mais rápida de falar com a Giselle. Responde em instantes!",
              action: "Mandar mensagem",
              href: "https://wa.me/5531997969787",
              color: "bg-green-500 hover:bg-green-600",
            },
            {
              icon: Mail,
              title: "Instagram",
              desc: "Siga e acompanhe os lançamentos e novidades em primeira mão.",
              action: "Seguir no Instagram",
              href: "https://instagram.com",
              color: "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
            },
          ].map((item) => (
            <ScrollReveal key={item.title}>
              <div className="p-8 rounded-2xl bg-white shadow-[var(--shadow-card)] flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-dark)] mb-2">{item.title}</h2>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold transition-colors ${item.color}`}
                >
                  {item.action}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="p-8 rounded-2xl bg-[var(--color-dark)] text-white text-center">
            <MapPin className="w-8 h-8 text-[var(--color-accent)] mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Atendimento Online</h2>
            <p className="text-white/60">Atendemos clientes em todo o Brasil. Envio para qualquer cidade!</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
