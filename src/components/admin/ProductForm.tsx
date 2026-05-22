"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateProductSlug } from "@/lib/utils/slugify";
import { CATEGORIES, BANHO_OPTIONS } from "@/types/database";
import type { Product } from "@/types/database";

const schema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  code: z.string().min(1, "Código obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Preço obrigatório"),
  category: z.string().min(1, "Categoria obrigatória"),
  banho: z.string().optional(),
  stone: z.string().optional(),
  size: z.string().optional(),
  is_new: z.boolean().default(false),
  is_bestseller: z.boolean().default(false),
  is_active: z.boolean().default(true),
});
type FormData = z.infer<typeof schema>;

export function ProductForm({ product }: { product: Product | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: product ? {
      name: product.name,
      code: product.code,
      description: product.description ?? "",
      price: product.price,
      category: product.category,
      banho: product.banho ?? "",
      stone: product.stone ?? "",
      size: product.size ?? "",
      is_new: product.is_new,
      is_bestseller: product.is_bestseller,
      is_active: product.is_active,
    } : { is_active: true, is_new: false, is_bestseller: false },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("products").upload(filename, file, { upsert: true });
    if (error) { toast.error("Erro no upload."); setUploading(false); return; }
    const { data } = supabase.storage.from("products").getPublicUrl(filename);
    setImageUrl(data.publicUrl);
    setUploading(false);
    toast.success("Imagem enviada!");
  }

  async function onSubmit(data: FormData) {
    if (!imageUrl) { toast.error("Adicione uma imagem ao produto."); return; }
    setLoading(true);
    const supabase = createClient();
    const slug = product?.slug ?? generateProductSlug(data.name, data.code);
    const payload = {
      ...data,
      slug,
      price_installments: parseFloat((data.price / 3).toFixed(2)),
      installments_count: 3,
      image_url: imageUrl,
      gallery_urls: product?.gallery_urls ?? [],
    };

    const { error } = product
      ? await supabase.from("products").update(payload as never).eq("id", product.id)
      : await supabase.from("products").insert(payload as never);

    setLoading(false);
    if (error) { toast.error("Erro ao salvar: " + error.message); return; }
    toast.success(product ? "Produto atualizado!" : "Produto criado!");
    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Image upload */}
      <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="font-bold text-[var(--color-dark)] mb-4">Imagem principal</h2>
        <div className="flex gap-4 items-start">
          {imageUrl ? (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="96px" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-300" />
            </div>
          )}
          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Upload className="w-4 h-4" /> Escolher foto</>}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
            <p className="text-xs text-gray-400 mt-2">JPG ou PNG. Máx 5MB.</p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="font-bold text-[var(--color-dark)] mb-4">Informações</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input {...register("name")} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
            <input {...register("code")} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono" />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea {...register("description")} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
            <input type="number" step="0.01" {...register("price")} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
            <input {...register("size")} placeholder="Ex: 16, P, M, Regulável" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <select {...register("category")} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              {CATEGORIES.filter(c => c !== "Todos").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banho</label>
            <select {...register("banho")} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              <option value="">Sem banho</option>
              {BANHO_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pedra</label>
            <input {...register("stone")} placeholder="Ex: Cristal, Verde" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6 pt-2">
          {([["is_active", "Ativo"], ["is_new", "Novidade"], ["is_bestseller", "Mais vendido"]] as const).map(([field, label]) => (
            <label key={field} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register(field)} className="w-4 h-4 accent-[var(--color-primary)]" />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Salvando..." : (product ? "Salvar alterações" : "Criar produto")}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-semibold">
          Cancelar
        </button>
      </div>
    </form>
  );
}
