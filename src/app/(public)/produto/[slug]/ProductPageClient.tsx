"use client";

import { Heart, Share2, ShoppingBag, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { LightboxGallery } from "@/components/product/LightboxGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/ui/ScrollReveal";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, formatInstallments, buildProductMessage } from "@/lib/utils/format";
import type { Product } from "@/types/database";

interface ProductPageClientProps {
  product: Product;
  related: Product[];
}

export function ProductPageClient({ product, related }: ProductPageClientProps) {
  const { toggle, has } = useWishlist();
  const { add } = useCart();
  const isFav = has(product.id);
  const [copied, setCopied] = useState(false);

  const allImages = [product.image_url, ...product.gallery_urls].filter(Boolean);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "5531997969787";

  function handleFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isFav) {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 80, spread: 60,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
        colors: ["#FFB627", "#FF006E", "#FFFFFF"],
      });
    }
    toggle({ id: product.id, slug: product.slug, name: product.name, code: product.code, price: product.price, image_url: product.image_url });
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text: `Olha essa peça linda: ${product.name}`, url }); return; } catch {}
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  const waMessage = buildProductMessage(product.name, product.code, product.price);
  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="pt-24 pb-20 bg-[var(--color-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Product grid */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-20">
          {/* Gallery */}
          <ScrollReveal direction="left">
            <LightboxGallery images={allImages} alt={product.name} />
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="flex flex-col gap-5">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {product.is_new && (
                  <span className="px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">NOVIDADE</span>
                )}
                {product.is_bestseller && (
                  <span className="px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-[var(--color-accent-dark)] to-[var(--color-accent)]">MAIS VENDIDO</span>
                )}
              </div>

              {/* Category + Code */}
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{product.category}</span>
                {product.banho && <><span>·</span><span>Banho {product.banho}</span></>}
                <span>·</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">#{product.code}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-dark)] leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div>
                <p className="text-4xl font-bold text-[var(--color-dark)] font-[var(--font-playfair)] italic">
                  {formatPrice(product.price)}
                </p>
                {product.price_installments && (
                  <p className="text-gray-500 text-sm mt-1">ou {formatInstallments(product.price)}</p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              )}

              {/* Extra info */}
              <div className="flex flex-wrap gap-3">
                {product.stone && (
                  <span className="px-3 py-1.5 text-sm rounded-xl bg-white border border-gray-200 text-gray-600">
                    Pedra: {product.stone}
                  </span>
                )}
                {product.size && (
                  <span className="px-3 py-1.5 text-sm rounded-xl bg-white border border-gray-200 text-gray-600">
                    Tamanho: {product.size}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <MagneticButton
                  as="a"
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors gap-3 shadow-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  Quero essa peça!
                </MagneticButton>

                <button
                  onClick={() => add({ id: product.id, slug: product.slug, name: product.name, code: product.code, price: product.price, image_url: product.image_url })}
                  className="py-4 px-5 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold transition-colors flex items-center gap-2"
                  aria-label="Adicionar ao orçamento"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Orçar
                </button>
              </div>

              {/* Secondary actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    isFav
                      ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-pink-50"
                      : "border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-[var(--color-primary)]" : ""}`} />
                  {isFav ? "Favoritado" : "Favoritar"}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-400 text-sm font-semibold transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  {copied ? "Copiado!" : "Compartilhar"}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                {[
                  { emoji: "✦", text: "Qualidade garantida" },
                  { emoji: "📦", text: "Entrega para todo Brasil" },
                  { emoji: "💬", text: "Suporte pelo WhatsApp" },
                ].map((item) => (
                  <div key={item.text} className="text-center">
                    <p className="text-xl mb-1">{item.emoji}</p>
                    <p className="text-xs text-gray-500 leading-tight">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <ScrollReveal className="mb-8">
              <h2 className="text-2xl font-extrabold text-[var(--color-dark)]">Você também vai gostar</h2>
            </ScrollReveal>
            <ScrollRevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ScrollRevealItem key={p.id}>
                  <ProductCard product={p} />
                </ScrollRevealItem>
              ))}
            </ScrollRevealGroup>
          </div>
        )}
      </div>
    </div>
  );
}
