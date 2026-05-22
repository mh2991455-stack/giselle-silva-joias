"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, buildBudgetMessage } from "@/lib/utils/format";
import Link from "next/link";

export function CartDrawer() {
  const { items, remove, updateQty, total, count, isOpen, setOpen } = useCart();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "5531997969787";

  function handleBudget() {
    const msg = buildBudgetMessage(items.map((i) => ({
      name: i.name,
      code: i.code,
      price: i.price,
      quantity: i.quantity,
    })));
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                <h2 className="font-bold text-lg text-[var(--color-dark)]">
                  Orçamento
                  {count > 0 && <span className="ml-2 text-sm font-normal text-gray-400">({count} {count === 1 ? "item" : "itens"})</span>}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Fechar orçamento"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-200" />
                  <p className="text-gray-400">Seu orçamento está vazio</p>
                  <Link
                    href="/catalogo"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Ver catálogo
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-dark)] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">cód. {item.code}</p>
                      <p className="text-sm font-bold text-[var(--color-primary)] mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors" aria-label="Diminuir quantidade">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors" aria-label="Aumentar quantidade">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => remove(item.id)} className="ml-auto text-gray-400 hover:text-red-500 transition-colors" aria-label="Remover item">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total estimado</span>
                  <span className="text-xl font-bold text-[var(--color-dark)] font-[var(--font-playfair)] italic">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={handleBudget}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Pedir orçamento pelo WhatsApp
                </button>
                <p className="text-xs text-center text-gray-400">Os preços podem variar. A Giselle confirmará os valores.</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
