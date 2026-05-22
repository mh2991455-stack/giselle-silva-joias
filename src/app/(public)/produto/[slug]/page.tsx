import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/supabase/queries";
import { ProductPageClient } from "./ProductPageClient";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };

  return {
    title: product.name,
    description: product.description ?? `${product.name} - Semijoia banhada ${product.banho ?? ""}. Código: ${product.code}. Preço: R$ ${product.price}.`,
    openGraph: {
      title: `${product.name} | Giselle Silva`,
      description: product.description ?? `${product.name} - Código ${product.code}`,
      images: [{ url: product.image_url, width: 800, height: 800, alt: product.name }],
    },
  };
}

export const revalidate = 3600;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.code,
    image: [product.image_url, ...product.gallery_urls],
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Giselle Silva Joias & Semijoias" },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductPageClient product={product} related={related} />
    </>
  );
}
