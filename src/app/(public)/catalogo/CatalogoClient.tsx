"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollRevealGroup, ScrollRevealItem } from "@/components/ui/ScrollReveal";
import { CATEGORIES, BANHO_OPTIONS } from "@/types/database";
import type { Product, SortOption } from "@/types/database";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "destaque", label: "Destaque" },
  { value: "novidades", label: "Novidades" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
];

interface CatalogoClientProps {
  products: Product[];
  initialParams: Record<string, string | undefined>;
}

export function CatalogoClient({ products, initialParams }: CatalogoClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [category, setCategory] = useState(initialParams.categoria ?? "Todos");
  const [banho, setBanho] = useState(initialParams.banho ?? "");
  const [sort, setSort] = useState<SortOption>((initialParams.ordem as SortOption) ?? "destaque");
  const [search, setSearch] = useState(initialParams.q ?? "");
  const [debouncedSearch] = useDebounce(search, 250);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === "Todos" || p.category.toLowerCase().includes(category.toLowerCase());
      const matchBanho = !banho || p.banho === banho;
      const matchSearch = !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchCat && matchBanho && matchSearch;
    });
  }, [products, category, banho, debouncedSearch]);

  function updateURL(newParams: Record<string, string>) {
    const params = new URLSearchParams();
    Object.entries(newParams).forEach(([k, v]) => { if (v && v !== "Todos") params.set(k, v); });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleCategory(cat: string) {
    setCategory(cat);
    updateURL({ categoria: cat, banho, ordem: sort, q: search });
  }

  function clearFilters() {
    setCategory("Todos");
    setBanho("");
    setSort("destaque");
    setSearch("");
    router.push(pathname, { scroll: false });
  }

  const hasFilters = category !== "Todos" || banho || sort !== "destaque" || search;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[var(--color-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="py-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-dark)]">Catálogo</h1>
            <p className="text-gray-500 mt-1">{filtered.length} {filtered.length === 1 ? "peça" : "peças"} encontradas</p>
          </div>

          {/* Search + Sort */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar... (pressione /)"
                className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-48 sm:w-64"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              aria-label="Ordenar por"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 snap-x scrollbar-none mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)]"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Banho filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {BANHO_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => setBanho(banho === b ? "" : b)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                banho === b
                  ? "bg-[var(--color-accent)] text-[var(--color-dark)] border-[var(--color-accent)]"
                  : "bg-white border-gray-200 text-gray-500 hover:border-[var(--color-accent)]"
              }`}
            >
              {b}
            </button>
          ))}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
            >
              <X className="w-3 h-3" /> Limpar filtros
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <SlidersHorizontal className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhuma peça encontrada com esses filtros.</p>
            <button onClick={clearFilters} className="mt-4 text-[var(--color-primary)] font-semibold hover:underline">
              Limpar filtros
            </button>
          </div>
        ) : (
          <ScrollRevealGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ScrollRevealItem key={product.id}>
                <ProductCard product={product} />
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        )}
      </div>
    </div>
  );
}
