import { createClient } from "./server";
import type { Product, SiteSettings, Testimonial, SortOption } from "@/types/database";

/* ── PRODUCTS ────────────────────────────────────────────────────────────── */

export async function getProducts(opts?: {
  category?: string;
  banho?: string;
  search?: string;
  sort?: SortOption;
  limit?: number;
  offset?: number;
  isNew?: boolean;
  isBestseller?: boolean;
}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").eq("is_active", true);

  if (opts?.category && opts.category !== "Todos") {
    query = query.eq("category", opts.category);
  }
  if (opts?.banho) {
    query = query.eq("banho", opts.banho);
  }
  if (opts?.search) {
    query = query.ilike("name", `%${opts.search}%`);
  }
  if (opts?.isNew) {
    query = query.eq("is_new", true);
  }
  if (opts?.isBestseller) {
    query = query.eq("is_bestseller", true);
  }

  const sort = opts?.sort ?? "destaque";
  switch (sort) {
    case "novidades":
      query = query.order("created_at", { ascending: false });
      break;
    case "menor-preco":
      query = query.order("price", { ascending: true });
      break;
    case "maior-preco":
      query = query.order("price", { ascending: false });
      break;
    case "destaque":
    default:
      query = query.order("sort_order", { ascending: true });
      break;
  }

  if (opts?.limit) query = query.limit(opts.limit);
  if (opts?.offset) query = query.range(opts.offset, (opts.offset ?? 0) + (opts.limit ?? 50) - 1);

  const { data, error } = await query;
  if (error) throw new Error(`getProducts: ${error.message}`);
  return (data as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data as Product;
}

export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit = 4
): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .neq("id", excludeId)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) return [];
  return (data as Product[]) ?? [];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_bestseller", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) return [];
  return (data as Product[]) ?? [];
}

export async function getNewProducts(limit = 6): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_new", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Product[]) ?? [];
}

export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);

  if (error) return [];
  return data?.map((p) => (p as { slug: string }).slug) ?? [];
}

/* ── TESTIMONIALS ────────────────────────────────────────────────────────── */

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data as Testimonial[]) ?? [];
}

/* ── SITE SETTINGS ───────────────────────────────────────────────────────── */

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  return data as SiteSettings;
}

/* ── NEWSLETTER ──────────────────────────────────────────────────────────── */

export async function subscribeNewsletter(email: string): Promise<{ ok: boolean; message: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter").insert({ email } as never);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "Este e-mail já está cadastrado." };
    }
    return { ok: false, message: "Erro ao cadastrar. Tente novamente." };
  }
  return { ok: true, message: "Você está na lista! ✨" };
}
