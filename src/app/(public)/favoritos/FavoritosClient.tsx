"use client";

import { Heart, MessageCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, buildFavoritesMessage } from "@/lib/utils/format";

export function FavoritosClient() {
  const { items, toggle } = useWishlist();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "5531997969787";

  function handleSendWhatsApp() {
    const msg = buildFavoritesMessage(items.map((i) => ({ name: i.name, code: i.code, price: i.price })));
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[var(--color-light)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-dark)] flex items-center gap-3">
              <Heart className="w-9 h-9 text-[var(--color-primary)]" />
              Favoritos
            </h1>
            <p className="text-gray-500 mt-1">{items.length} {items.length === 1 ? "peça" : "peças"} salva{items.length === 1 ? "" : "s"}</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Enviar lista</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <Heart className="w-20 h-20 text-gray-200" />
            <div>
              <p className="text-xl font-semibold text-gray-400">Nenhuma peça favorita ainda</p>
              <p className="text-gray-400 mt-2">Clique no coração de qualquer peça para salvar aqui.</p>
            </div>
            <Link href="/catalogo" className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] transition-colors">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white shadow-[var(--shadow-card)]">
                <Link href={`/produto/${item.slug}`} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <Image src={item.image_url} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="96px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/produto/${item.slug}`} className="font-bold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">cód. {item.code}</p>
                  <p className="text-xl font-bold text-[var(--color-dark)] font-[var(--font-playfair)] italic mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => toggle(item)}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remover dos favoritos"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá Giselle! Tenho interesse nessa peça:\n\n✨ ${item.name}\n📋 Código: ${item.code}\n💰 ${formatPrice(item.price)}\n\nEstá disponível?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white transition-colors"
                    aria-label="Perguntar sobre esta peça"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Send all */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-lg"
              >
                <MessageCircle className="w-6 h-6" />
                Enviar toda a lista para a Giselle
              </button>
              <p className="text-xs text-center text-gray-400 mt-3">A Giselle vai confirmar disponibilidade e preços pelo WhatsApp.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
