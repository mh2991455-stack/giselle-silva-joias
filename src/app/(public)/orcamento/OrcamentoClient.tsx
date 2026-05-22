"use client";

import { ShoppingBag, MessageCircle, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, buildBudgetMessage } from "@/lib/utils/format";

export function OrcamentoClient() {
  const { items, remove, updateQty, total, clear } = useCart();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "5531997969787";

  function handleBudget() {
    const msg = buildBudgetMessage(items.map((i) => ({ name: i.name, code: i.code, price: i.price, quantity: i.quantity })));
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[var(--color-light)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="py-8">
          <h1 className="text-4xl font-extrabold text-[var(--color-dark)] flex items-center gap-3">
            <ShoppingBag className="w-9 h-9 text-[var(--color-primary)]" />
            Orçamento
          </h1>
          <p className="text-gray-500 mt-1">Monte sua lista e envie para a Giselle pelo WhatsApp.</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <ShoppingBag className="w-20 h-20 text-gray-200" />
            <p className="text-xl font-semibold text-gray-400">Nenhuma peça no orçamento</p>
            <Link href="/catalogo" className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] transition-colors">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white shadow-[var(--shadow-card)]">
                  <Link href={`/produto/${item.slug}`} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--color-dark)] line-clamp-1 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400">cód. {item.code}</p>
                    <p className="text-base font-bold text-[var(--color-primary)] mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <p className="font-bold text-sm text-[var(--color-dark)]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-[var(--shadow-card)] space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-500">Total estimado</span>
                <span className="text-2xl font-bold text-[var(--color-dark)] font-[var(--font-playfair)] italic">{formatPrice(total)}</span>
              </div>
              <button onClick={handleBudget} className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg">
                <MessageCircle className="w-6 h-6" />
                Pedir orçamento pelo WhatsApp
              </button>
              <button onClick={clear} className="w-full py-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
                Limpar orçamento
              </button>
              <p className="text-xs text-center text-gray-400">Os preços podem variar. A Giselle confirmará os valores no WhatsApp.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
