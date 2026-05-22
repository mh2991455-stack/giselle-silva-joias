import type { Metadata } from "next";
import { CatalogoClient } from "./CatalogoClient";
import { getProducts } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explore nossa coleção completa de joias e semijoias. Anéis, brincos, colares, pulseiras, argolas e muito mais.",
};

export const revalidate = 3600;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  // Fetch all products — client handles category filter via matchesCategory mapping
  const products = await getProducts({
    banho: params.banho,
    search: params.q,
    sort: (params.ordem as "novidades" | "menor-preco" | "maior-preco" | "destaque") ?? "destaque",
  });

  return <CatalogoClient products={products} initialParams={params} />;
}
