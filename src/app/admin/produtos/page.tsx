import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";

type ProductRow = { id: string; name: string; code: string; price: number; category: string; image_url: string; is_active: boolean; is_new: boolean; is_bestseller: boolean };

export const revalidate = 0;

export default async function AdminProdutosPage() {
  const supabase = await createClient();
  const { data: rawProducts } = await supabase
    .from("products")
    .select("id, name, code, price, category, image_url, is_active, is_new, is_bestseller")
    .order("sort_order", { ascending: true });
  const products = rawProducts as ProductRow[] | null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-dark)]">Produtos</h1>
          <p className="text-gray-500 mt-1">{products?.length ?? 0} produtos cadastrados</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo produto
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products?.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-dark)] text-sm">{p.name}</p>
                        <p className="text-gray-400 text-xs font-mono">{p.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{p.category}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-[var(--color-dark)]">{formatPrice(p.price)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.is_active ? "Ativo" : "Inativo"}
                      </span>
                      {p.is_new && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">Novo</span>}
                      {p.is_bestseller && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Destaque</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <ToggleActiveButton id={p.id} isActive={p.is_active} />
                      <Link
                        href={`/admin/produtos/${p.id}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[var(--color-primary)] hover:bg-pink-50 transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
