"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, MessageSquare, Settings, Mail, LogOut, Gem } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquare },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-64 bg-[var(--color-dark)] min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Gem className="w-6 h-6 text-[var(--color-primary)]" />
          <span className="font-bold text-white">Giselle Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
