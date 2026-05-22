import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ui/ScrollReveal";
import type { Product } from "@/types/database";

export function FeaturedSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <ScrollReveal className="text-center mb-12">
        <p className="text-[var(--color-primary)] font-semibold text-sm tracking-widest uppercase mb-3">
          ✦ Destaque
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-dark)]">
          Mais vendidos
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          As peças preferidas das nossas clientes. Qualidade que fala por si.
        </p>
      </ScrollReveal>

      <ScrollRevealGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ScrollRevealItem key={product.id}>
            <ProductCard product={product} />
          </ScrollRevealItem>
        ))}
      </ScrollRevealGroup>

      <ScrollReveal className="text-center mt-10" delay={0.2}>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
        >
          Ver catálogo completo <ArrowRight className="w-5 h-5" />
        </Link>
      </ScrollReveal>
    </section>
  );
}
