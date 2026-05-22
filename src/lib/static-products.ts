import { rawProducts, IMAGE_BASE_URL, PLACEHOLDER_IMAGE } from "@/data/products";
import type { Product } from "@/types/database";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toProduct(
  raw: (typeof rawProducts)[number],
  index: number
): Product {
  const image_url = raw.image
    ? `${IMAGE_BASE_URL}${raw.image}`
    : PLACEHOLDER_IMAGE;

  return {
    id: `static-${index}`,
    slug: slugify(`${raw.name} ${raw.code}`),
    name: raw.name,
    description: ("description" in raw ? raw.description : null) ?? null,
    price: raw.price,
    price_installments: Number((raw.price / 3).toFixed(2)),
    installments_count: 3,
    category: raw.category,
    banho: raw.banho ?? null,
    stone: ("stone" in raw ? raw.stone : null) ?? null,
    code: raw.code,
    size: ("size" in raw ? raw.size : null) ?? null,
    image_url,
    gallery_urls: [],
    is_new: ("isNew" in raw ? raw.isNew : false) ?? false,
    is_bestseller: ("isBestseller" in raw ? raw.isBestseller : false) ?? false,
    is_active: true,
    sort_order: index,
    created_at: new Date().toISOString(),
  };
}

export const staticProducts: Product[] = rawProducts.map(toProduct);
