"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Testimonial } from "@/types/database";

export default function AdminDepoimentosPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems((data as Testimonial[]) ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing?.name || !editing?.content) { toast.error("Preencha nome e depoimento."); return; }
    setLoading(true);
    const supabase = createClient();
    const payload = { name: editing.name, content: editing.content, rating: editing.rating ?? 5, is_active: editing.is_active ?? true };
    const { error } = editing.id
      ? await supabase.from("testimonials").update(payload as never).eq("id", editing.id)
      : await supabase.from("testimonials").insert(payload as never);
    setLoading(false);
    if (error) { toast.error("Erro: " + error.message); return; }
    toast.success(editing.id ? "Atualizado!" : "Criado!");
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este depoimento?")) return;
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    toast.success("Removido!");
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--color-dark)]">Depoimentos</h1>
        <button onClick={() => setEditing({ rating: 5, is_active: true })} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
          <Plus className="w-4 h-4" /> Novo
        </button>
      </div>

      {/* Form */}
      {editing && (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-[var(--color-dark)]">{editing.id ? "Editar" : "Novo"} depoimento</h2>
          <input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Nome do cliente" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          <textarea value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} placeholder="Depoimento..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
          <div className="flex gap-4 items-center">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setEditing({ ...editing, rating: n })}>
                  <Star className={`w-5 h-5 ${n <= (editing.rating ?? 5) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="accent-[var(--color-primary)]" />
              Ativo
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={loading} className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-dark)] disabled:opacity-60 transition-colors">
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button onClick={() => setEditing(null)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-[var(--color-dark)]">{t.name}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                {!t.is_active && <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">Inativo</span>}
              </div>
              <p className="text-gray-500 text-sm">{t.content}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditing(t)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[var(--color-primary)] hover:bg-pink-50 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
