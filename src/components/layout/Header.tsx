"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count: wishlistCount } = useWishlist();
  const { count: cartCount, setOpen: setCartOpen } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") { setSearchOpen(false); setMobileOpen(false); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  const navLinks = [
    { href: "/catalogo", label: "Catálogo" },
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          scrolled
            ? "glass-light shadow-[var(--shadow-glass)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Logo variant={scrolled ? "default" : "white"} size="md" />

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-[var(--color-primary)] ${
                  scrolled ? "text-[var(--color-dark)]" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                scrolled ? "hover:bg-gray-100 text-[var(--color-dark)]" : "hover:bg-white/20 text-white"
              }`}
              aria-label="Buscar"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/favoritos"
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                scrolled ? "hover:bg-gray-100 text-[var(--color-dark)]" : "hover:bg-white/20 text-white"
              }`}
              aria-label={`Favoritos${wishlistCount > 0 ? ` (${wishlistCount})` : ""}`}
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                scrolled ? "hover:bg-gray-100 text-[var(--color-dark)]" : "hover:bg-white/20 text-white"
              }`}
              aria-label={`Orçamento${cartCount > 0 ? ` (${cartCount})` : ""}`}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                scrolled ? "hover:bg-gray-100 text-[var(--color-dark)]" : "hover:bg-white/20 text-white"
              }`}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 pt-20 bg-[var(--color-dark)]" onClick={() => setMobileOpen(false)}>
          <nav className="flex flex-col items-center gap-8 py-12" aria-label="Navegação mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-bold text-white hover:text-[var(--color-primary)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/favoritos" className="text-2xl font-bold text-white hover:text-[var(--color-primary)] transition-colors" onClick={() => setMobileOpen(false)}>
              Favoritos {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
          </nav>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
          <form onSubmit={handleSearch} className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar joias e semijoias..."
                className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl bg-white shadow-2xl outline-none"
                autoFocus
              />
            </div>
            <p className="text-center text-white/60 text-sm mt-3">Pressione Enter para buscar · Esc para fechar</p>
          </form>
        </div>
      )}
    </>
  );
}
