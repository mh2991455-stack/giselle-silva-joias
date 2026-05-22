import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "novo";

  let product = null;
  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    if (!data) notFound();
    product = data;
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[var(--color-dark)] mb-8">
        {isNew ? "Novo produto" : "Editar produto"}
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
