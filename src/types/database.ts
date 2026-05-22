export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      testimonials: {
        Row: Testimonial;
        Insert: TestimonialInsert;
        Update: TestimonialUpdate;
      };
      newsletter: {
        Row: Newsletter;
        Insert: { email: string };
        Update: Partial<{ email: string }>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Partial<SiteSettings>;
        Update: Partial<SiteSettings>;
      };
    };
  };
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  price_installments: number | null;
  installments_count: number;
  category: string;
  banho: string | null;
  stone: string | null;
  code: string;
  size: string | null;
  image_url: string;
  gallery_urls: string[];
  is_new: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export type ProductInsert = Omit<Product, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
export type ProductUpdate = Partial<ProductInsert>;

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  photo_url: string | null;
  rating: number;
  is_active: boolean;
  created_at: string;
}

export type TestimonialInsert = Omit<Testimonial, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
export type TestimonialUpdate = Partial<TestimonialInsert>;

export interface Newsletter {
  id: string;
  email: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  about_giselle: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  whatsapp_number: string;
  instagram_url: string | null;
  updated_at: string;
}

/* Categoria e banho para uso em filtros */
export const CATEGORIES = [
  "Todos",
  "Anéis",
  "Brincos",
  "Argolas",
  "Colares",
  "Chokers",
  "Correntes",
  "Pulseiras",
  "Braceletes",
  "Pingentes",
  "Escapulários",
  "Conjuntos",
  "Trios",
  "Piercings",
  "Infantil",
  "Masculino",
  "Cuidados",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

export const BANHO_OPTIONS = [
  "Ouro",
  "Prata",
  "Prata 925",
  "Steel-Gold",
] as const;

export type BanhoType = (typeof BANHO_OPTIONS)[number];

export type SortOption = "novidades" | "menor-preco" | "maior-preco" | "destaque";

/* Wishlist item stored in localStorage */
export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  code: string;
  price: number;
  image_url: string;
}

/* Budget cart item */
export interface CartItem {
  id: string;
  slug: string;
  name: string;
  code: string;
  price: number;
  image_url: string;
  quantity: number;
}
