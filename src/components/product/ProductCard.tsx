"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Gem } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types/database";
import confetti from "canvas-confetti";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggle, has } = useWishlist();
  const { add } = useCart();
  const isFav = has(product.id);
  const [imgError, setImgError] = useState(false);

  function handleFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!isFav) {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#FFB627", "#FF006E", "#FFFFFF"],
        scalar: 0.9,
      });
    }

    toggle({
      id: product.id,
      slug: product.slug,
      name: product.name,
      code: product.code,
      price: product.price,
      image_url: product.image_url,
    });
  }

  function handleAddCart(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      code: product.code,
      price: product.price,
      image_url: product.image_url,
    });
  }

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="px-2.5 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] -rotate-3 shadow-sm">
              NOVIDADE
            </span>
          )}
          {product.is_bestseller && !product.is_new && (
            <span className="px-2.5 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-[var(--color-accent-dark)] to-[var(--color-accent)] -rotate-3 shadow-sm">
              + VENDIDO
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200"
          aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors duration-200 ${isFav ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-gray-400"}`}
          />
        </button>

        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #fff8f0 0%, #ffe8f0 100%)" }}
            >
              <Gem className="w-10 h-10 text-[var(--color-primary)]/30" />
              <p className="text-xs text-gray-400 text-center px-4">{product.name}</p>
            </div>
          ) : (
            <Image
              src={product.image_url}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
              unoptimized={product.image_url.startsWith("https://placehold")}
            />
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">{product.category}</p>
          <h3 className="font-semibold text-[var(--color-dark)] text-sm leading-tight line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors duration-200">
            {product.name}
          </h3>

          {product.banho && (
            <p className="text-xs text-gray-400 mb-2">Banho {product.banho}</p>
          )}

          <div className="flex items-end justify-between gap-2 mt-auto">
            <div>
              <p className="text-lg font-bold text-[var(--color-dark)] font-[var(--font-playfair)] italic">
                {formatPrice(product.price)}
              </p>
              {product.price_installments && (
                <p className="text-xs text-gray-400">
                  3x de {formatPrice(product.price_installments)}
                </p>
              )}
            </div>

            <button
              onClick={handleAddCart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors duration-200 shrink-0"
              aria-label={`Adicionar ${product.name} ao orçamento`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Orçar
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
