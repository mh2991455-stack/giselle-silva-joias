"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({ email: z.string().email("E-mail inválido") });
type FormData = z.infer<typeof schema>;

export function Footer() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json();
      if (json.ok) {
        toast.success("Você está na lista! ✨");
        reset();
      } else {
        toast.error(json.message ?? "Erro ao cadastrar.");
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-[var(--color-dark)] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">Fique por dentro das novidades</h2>
            <p className="text-white/60 mt-1">Ofertas exclusivas e lançamentos direto no seu e-mail.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 w-full md:w-auto">
            <div className="flex-1 md:w-72">
              <input
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] font-semibold transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? "..." : "Quero receber"}
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <Logo variant="white" size="md" className="mb-4" />
          <p className="text-white/50 text-sm leading-relaxed">
            Joias e semijoias com estilo, qualidade e preço justo. Atendimento direto e personalizado.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-white/80 uppercase text-xs tracking-wider">Loja</h3>
          <ul className="space-y-2">
            {[
              { href: "/catalogo", label: "Catálogo" },
              { href: "/catalogo?novo=true", label: "Novidades" },
              { href: "/catalogo?destaque=true", label: "Mais vendidos" },
              { href: "/favoritos", label: "Meus favoritos" },
              { href: "/orcamento", label: "Orçamento" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/50 hover:text-white text-sm transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-white/80 uppercase text-xs tracking-wider">Institucional</h3>
          <ul className="space-y-2">
            {[
              { href: "/sobre", label: "Sobre a Giselle" },
              { href: "/contato", label: "Contato" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/50 hover:text-white text-sm transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-white/80 uppercase text-xs tracking-wider">Contato</h3>
          <div className="space-y-3">
            <a
              href="https://wa.me/5531997969787"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/50 hover:text-green-400 text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/50 hover:text-[var(--color-primary)] text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
            <a
              href="mailto:contato@gisellesilva.com"
              className="flex items-center gap-2 text-white/50 hover:text-[var(--color-accent)] text-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              E-mail
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/30 text-xs">
          <p>© {new Date().getFullYear()} Giselle Silva Joias & Semijoias. Todos os direitos reservados.</p>
          <p>Feito com ♥ no Brasil</p>
        </div>
      </div>
    </footer>
  );
}
