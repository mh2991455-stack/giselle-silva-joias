import { createClient } from "@/lib/supabase/server";
import { Package, Star, Sparkles, Mail } from "lucide-react";

async function getStats() {
  const supabase = await createClient();
  const [products, newProducts, testimonials, newsletter] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_new", true),
    supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("newsletter").select("id", { count: "exact", head: true }),
  ]);
  return {
    products: products.count ?? 0,
    newProducts: newProducts.count ?? 0,
    testimonials: testimonials.count ?? 0,
    newsletter: newsletter.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Produtos ativos", value: stats.products, icon: Package, color: "from-[var(--color-primary)] to-[var(--color-primary-dark)]" },
    { label: "Novidades", value: stats.newProducts, icon: Sparkles, color: "from-[var(--color-accent-dark)] to-[var(--color-accent)]" },
    { label: "Depoimentos", value: stats.testimonials, icon: Star, color: "from-purple-500 to-purple-700" },
    { label: "Newsletter", value: stats.newsletter, icon: Mail, color: "from-emerald-500 to-emerald-700" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[var(--color-dark)] mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0`}>
              <card.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[var(--color-dark)]">{card.value}</p>
              <p className="text-gray-500 text-sm">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white">
        <h2 className="text-xl font-bold mb-2">Bem-vinda, Giselle! 💎</h2>
        <p className="text-white/80">Use o menu lateral para gerenciar seus produtos, depoimentos e configurações da loja.</p>
      </div>
    </div>
  );
}
