import { createClient } from "./server";
import type { Product, SiteSettings, Testimonial, SortOption } from "@/types/database";
import { staticProducts } from "@/lib/static-products";

/* ── helpers ─────────────────────────────────────────────────────────────── */

function filterStatic(opts?: {
  category?: string;
  banho?: string;
  search?: string;
  sort?: SortOption;
  limit?: number;
  isNew?: boolean;
  isBestseller?: boolean;
}): Product[] {
  let list = staticProducts;

  if (opts?.category && opts.category !== "Todos") {
    list = list.filter((p) => p.category === opts.category);
  }
  if (opts?.banho) {
    list = list.filter((p) => p.banho === opts.banho);
  }
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (opts?.isNew) list = list.filter((p) => p.is_new);
  if (opts?.isBestseller) list = list.filter((p) => p.is_bestseller);

  const sort = opts?.sort ?? "destaque";
  if (sort === "novidades") list = [...list].reverse();
  else if (sort === "menor-preco") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "maior-preco") list = [...list].sort((a, b) => b.price - a.price);

  if (opts?.limit) list = list.slice(0, opts.limit);
  return list;
}

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
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*").eq("is_active", true);

    if (opts?.category && opts.category !== "Todos") {
      query = query.eq("category", opts.category);
    }
    if (opts?.banho) query = query.eq("banho", opts.banho);
    if (opts?.search) query = query.ilike("name", `%${opts.search}%`);
    if (opts?.isNew) query = query.eq("is_new", true);
    if (opts?.isBestseller) query = query.eq("is_bestseller", true);

    const sort = opts?.sort ?? "destaque";
    switch (sort) {
      case "novidades": query = query.order("created_at", { ascending: false }); break;
      case "menor-preco": query = query.order("price", { ascending: true }); break;
      case "maior-preco": query = query.order("price", { ascending: false }); break;
      default: query = query.order("sort_order", { ascending: true });
    }

    if (opts?.limit) query = query.limit(opts.limit);
    if (opts?.offset)
      query = query.range(opts.offset, (opts.offset ?? 0) + (opts.limit ?? 50) - 1);

    const { data, error } = await query;
    if (error || !data?.length) return filterStatic(opts);
    return data as Product[];
  } catch {
    return filterStatic(opts);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (!error && data) return data as Product;
  } catch {}

  return staticProducts.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(
  category: string,
  excludeId: string,
  limit = 4
): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .neq("id", excludeId)
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (!error && data?.length) return data as Product[];
  } catch {}

  return staticProducts
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, limit);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_bestseller", true)
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (!error && data?.length) return data as Product[];
  } catch {}

  return staticProducts.filter((p) => p.is_bestseller).slice(0, limit);
}

export async function getNewProducts(limit = 6): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!error && data?.length) return data as Product[];
  } catch {}

  return staticProducts.filter((p) => p.is_new).slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("slug")
      .eq("is_active", true);

    if (!error && data?.length)
      return data.map((p) => (p as { slug: string }).slug);
  } catch {}

  return staticProducts.map((p) => p.slug);
}

/* ── TESTIMONIALS ────────────────────────────────────────────────────────── */

const STATIC_TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Ana Paula", content: "Comprei um colar e ficou lindo! A qualidade é incrível e chegou super rápido. Já indiquei para várias amigas.", rating: 5, photo_url: null, is_active: true, created_at: new Date().toISOString() },
  { id: "t2", name: "Fernanda Costa", content: "Atendimento maravilhoso da Giselle! As joias são lindas e o banho é de altíssima qualidade. Voltarei com certeza!", rating: 5, photo_url: null, is_active: true, created_at: new Date().toISOString() },
  { id: "t3", name: "Mariana Souza", content: "Adoro as peças da Giselle! Tenho várias e nunca tive problema nenhum. Qualidade top demais!", rating: 5, photo_url: null, is_active: true, created_at: new Date().toISOString() },
  { id: "t4", name: "Juliana Mendes", content: "Os brincos que comprei são perfeitos! Não desbotaram e estou usando há meses. Super recomendo!", rating: 5, photo_url: null, is_active: true, created_at: new Date().toISOString() },
];

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data?.length) return data as Testimonial[];
  } catch {}

  return STATIC_TESTIMONIALS;
}

/* ── SITE SETTINGS ───────────────────────────────────────────────────────── */

const STATIC_SETTINGS: SiteSettings = {
  id: 1,
  about_giselle: "Sou a Giselle Silva, apaixonada por semijoias de qualidade. Ofereço peças banhadas com garantia, atendimento personalizado e entrega para todo o Brasil.",
  hero_title: "Joias que contam a sua história",
  hero_subtitle: "Semijoias banhadas com qualidade e estilo. Atendimento direto com a Giselle.",
  whatsapp_number: "+5531997969787",
  instagram_url: null,
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data) return data as SiteSettings;
  } catch {}

  return STATIC_SETTINGS;
}

/* ── NEWSLETTER ──────────────────────────────────────────────────────────── */

export async function subscribeNewsletter(email: string): Promise<{ ok: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("newsletter").insert({ email } as never);

    if (!error) return { ok: true, message: "Você está na lista! ✨" };
    if (error.code === "23505") return { ok: false, message: "Este e-mail já está cadastrado." };
  } catch {}

  return { ok: true, message: "Você está na lista! ✨" };
}
