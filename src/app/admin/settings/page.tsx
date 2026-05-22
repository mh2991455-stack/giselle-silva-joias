"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/types/database";

const schema = z.object({
  hero_title: z.string().min(1, "Obrigatório"),
  hero_subtitle: z.string().min(1, "Obrigatório"),
  about_giselle: z.string().min(10, "Escreva pelo menos 10 caracteres"),
  whatsapp_number: z.string().min(10, "WhatsApp inválido"),
  instagram_url: z.string().url("URL inválida").or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (data) {
        const s = data as SiteSettings;
        reset({
          hero_title: s.hero_title ?? "",
          hero_subtitle: s.hero_subtitle ?? "",
          about_giselle: s.about_giselle ?? "",
          whatsapp_number: s.whatsapp_number ?? "+5531997969787",
          instagram_url: s.instagram_url ?? "",
        });
      }
    })();
  }, [reset]);

  async function onSubmit(data: FormData) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("site_settings").update({ ...data, updated_at: new Date().toISOString() } as never).eq("id", 1);
    setLoading(false);
    if (error) { toast.error("Erro ao salvar."); return; }
    toast.success("Configurações salvas!");
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[var(--color-dark)] mb-8">Configurações</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-[var(--color-dark)]">Hero da página inicial</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título principal</label>
            <input {...register("hero_title")} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            {errors.hero_title && <p className="text-red-500 text-xs mt-1">{errors.hero_title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
            <input {...register("hero_subtitle")} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            {errors.hero_subtitle && <p className="text-red-500 text-xs mt-1">{errors.hero_subtitle.message}</p>}
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-[var(--color-dark)]">Sobre a Giselle</h2>
          <textarea {...register("about_giselle")} rows={6} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" placeholder="Escreva sobre você, sua paixão por joias..." />
          {errors.about_giselle && <p className="text-red-500 text-xs mt-1">{errors.about_giselle.message}</p>}
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-[var(--color-dark)]">Contato & Redes</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (com DDI)</label>
            <input {...register("whatsapp_number")} placeholder="+5531999999999" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            {errors.whatsapp_number && <p className="text-red-500 text-xs mt-1">{errors.whatsapp_number.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input {...register("instagram_url")} placeholder="https://instagram.com/seuperfil" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            {errors.instagram_url && <p className="text-red-500 text-xs mt-1">{errors.instagram_url.message}</p>}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Salvando..." : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}
