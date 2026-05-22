import { ProductCard } from "@/components/product/ProductCard";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ui/ScrollReveal";
import type { Product } from "@/types/database";

export function NewArrivalsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 bg-[var(--color-light-dark)]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <p className="text-[var(--color-accent-dark)] font-semibold text-sm tracking-widest uppercase mb-3">
            ✦ Acabou de chegar
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-dark)]">
            Novidades
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Peças exclusivas recém-chegadas. Seja a primeira a ter.
          </p>
        </ScrollReveal>

        <ScrollRevealGroup className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <ScrollRevealItem key={product.id}>
              <ProductCard product={product} />
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
