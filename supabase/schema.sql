-- ============================================================
-- GISELLE SILVA — SCHEMA SUPABASE
-- Execute no SQL Editor do Supabase Dashboard (supabase.com)
-- ============================================================

-- === TABELA: products ===
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  price_installments numeric(10,2),
  installments_count int default 3,
  category text not null,
  banho text,
  stone text,
  code text unique not null,
  size text,
  image_url text not null,
  gallery_urls text[] default '{}',
  is_new boolean default false,
  is_bestseller boolean default false,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_is_new on products(is_new);
create index if not exists idx_products_is_bestseller on products(is_bestseller);

-- === TABELA: testimonials ===
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  content text not null,
  photo_url text,
  rating int default 5 check (rating >= 1 and rating <= 5),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- === TABELA: newsletter ===
create table if not exists newsletter (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- === TABELA: site_settings ===
create table if not exists site_settings (
  id int primary key default 1,
  about_giselle text,
  hero_title text default 'Joias que contam a sua história',
  hero_subtitle text default 'Semijoias banhadas com qualidade e estilo. Atendimento direto com a Giselle.',
  whatsapp_number text default '+5531997969787',
  instagram_url text,
  updated_at timestamptz default now()
);

-- Garantir que exista exatamente 1 registro de configurações
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- === RLS — ROW LEVEL SECURITY ===
alter table products enable row level security;
alter table testimonials enable row level security;
alter table newsletter enable row level security;
alter table site_settings enable row level security;

-- Products: público lê ativos, admin escreve tudo
drop policy if exists "public read active products" on products;
create policy "public read active products"
  on products for select
  using (is_active = true);

drop policy if exists "admin write products" on products;
create policy "admin write products"
  on products for all
  using (auth.jwt() ->> 'role' = 'admin');

-- Testimonials: público lê ativos, admin escreve tudo
drop policy if exists "public read testimonials" on testimonials;
create policy "public read testimonials"
  on testimonials for select
  using (is_active = true);

drop policy if exists "admin write testimonials" on testimonials;
create policy "admin write testimonials"
  on testimonials for all
  using (auth.jwt() ->> 'role' = 'admin');

-- Newsletter: público insere, admin lê
drop policy if exists "public insert newsletter" on newsletter;
create policy "public insert newsletter"
  on newsletter for insert
  with check (true);

drop policy if exists "admin read newsletter" on newsletter;
create policy "admin read newsletter"
  on newsletter for select
  using (auth.jwt() ->> 'role' = 'admin');

-- Site settings: público lê, admin edita
drop policy if exists "public read settings" on site_settings;
create policy "public read settings"
  on site_settings for select
  using (true);

drop policy if exists "admin write settings" on site_settings;
create policy "admin write settings"
  on site_settings for update
  using (auth.jwt() ->> 'role' = 'admin');

-- === STORAGE BUCKETS ===
-- Execute separadamente na seção Storage > New Bucket do Supabase Dashboard,
-- ou rode os comandos abaixo via supabase-js com service_role_key.

-- insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('testimonials', 'testimonials', true) on conflict do nothing;

-- Políticas de storage (execute após criar os buckets):
-- CREATE POLICY "public read products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
-- CREATE POLICY "admin write products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.jwt() ->> 'role' = 'admin');
-- CREATE POLICY "admin update products" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND auth.jwt() ->> 'role' = 'admin');
-- CREATE POLICY "admin delete products" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.jwt() ->> 'role' = 'admin');
-- CREATE POLICY "public read testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');
-- CREATE POLICY "admin write testimonials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'testimonials' AND auth.jwt() ->> 'role' = 'admin');

-- === DEPOIMENTOS PLACEHOLDER ===
insert into testimonials (name, content, rating) values
  ('Ana Paula', 'Comprei um colar e ficou lindo! A qualidade é incrível e chegou super rápido. Já indiquei para várias amigas.', 5),
  ('Fernanda Costa', 'Atendimento maravilhoso da Giselle! As joias são lindas e o banho é de altíssima qualidade. Voltarei com certeza!', 5),
  ('Mariana Souza', 'Adoro as peças da Giselle! Tenho várias e nunca tive problema nenhum. Qualidade top demais!', 5),
  ('Juliana Mendes', 'Os brincos que comprei são perfeitos! Não desbotaram e estou usando há meses. Super recomendo!', 5)
on conflict do nothing;
