/**
 * Script de seed — popula o Supabase com os 72 produtos da Giselle Silva.
 *
 * USO:
 *   1. Preencha o .env.local com NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
 *   2. npx tsx supabase/seed.ts
 *
 * O script faz download de cada imagem do site original e faz upload para
 * o bucket "products" do Supabase Storage, substituindo a image_url.
 * Produtos com image: null usam a imagem placeholder.
 */

import { createClient } from "@supabase/supabase-js";
import { rawProducts, IMAGE_BASE_URL, PLACEHOLDER_IMAGE } from "../src/data/products";

// Carregar variáveis de ambiente do .env.local manualmente (tsx não usa dotenv por padrão)
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  try {
    const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length) {
        process.env[key.trim()] = rest.join("=").trim();
      }
    }
  } catch {
    console.warn("⚠️  .env.local não encontrado, usando variáveis de ambiente existentes.");
  }
}

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

function generateSlug(name: string, code: string): string {
  return slugify(`${name} ${code}`);
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GiselleSeedBot/1.0)" },
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return Buffer.from(buf);
  } catch {
    return null;
  }
}

async function uploadToStorage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string | null> {
  const { error } = await supabase.storage
    .from("products")
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`  ❌ Upload falhou para ${filename}:`, error.message);
    return null;
  }

  const { data } = supabase.storage.from("products").getPublicUrl(filename);
  return data.publicUrl;
}

async function main() {
  loadEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes("YOUR_PROJECT")) {
    console.error("❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local antes de rodar o seed.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`\n🚀 Iniciando seed de ${rawProducts.length} produtos...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < rawProducts.length; i++) {
    const raw = rawProducts[i];
    const slug = generateSlug(raw.name, raw.code);
    const priceInstallments = parseFloat((raw.price / 3).toFixed(2));

    console.log(`[${i + 1}/${rawProducts.length}] ${raw.name} (${raw.code})`);

    let imageUrl: string;

    if (!raw.image) {
      imageUrl = PLACEHOLDER_IMAGE;
      console.log("  ⚪ Sem imagem — usando placeholder");
    } else {
      const originalUrl = `${IMAGE_BASE_URL}${raw.image}`;
      const ext = raw.image.endsWith(".jpeg") ? "jpeg" : "jpg";
      const contentType = `image/${ext === "jpeg" ? "jpeg" : "jpeg"}`;
      const storageFilename = `${raw.code.toLowerCase()}.${ext}`;

      console.log(`  ⬇️  Baixando imagem...`);
      const buffer = await downloadImage(originalUrl);

      if (!buffer) {
        console.log(`  ⚠️  Download falhou — usando placeholder`);
        imageUrl = PLACEHOLDER_IMAGE;
      } else {
        console.log(`  ⬆️  Enviando para Storage (${(buffer.length / 1024).toFixed(0)}kb)...`);
        const storedUrl = await uploadToStorage(supabase, buffer, storageFilename, contentType);
        imageUrl = storedUrl ?? PLACEHOLDER_IMAGE;
        if (storedUrl) {
          console.log(`  ✅ Storage: ${storedUrl.split("/").slice(-2).join("/")}`);
        }
      }
    }

    const product = {
      slug,
      name: raw.name,
      description: ("description" in raw ? raw.description : null) ?? null,
      price: raw.price,
      price_installments: priceInstallments,
      installments_count: 3,
      category: raw.category,
      banho: raw.banho ?? null,
      stone: ("stone" in raw ? raw.stone : null) ?? null,
      code: raw.code,
      size: ("size" in raw ? raw.size : null) ?? null,
      image_url: imageUrl,
      gallery_urls: [] as string[],
      is_new: ("isNew" in raw ? raw.isNew : false) ?? false,
      is_bestseller: ("isBestseller" in raw ? raw.isBestseller : false) ?? false,
      is_active: true,
      sort_order: i,
    };

    const { error } = await supabase
      .from("products")
      .upsert(product, { onConflict: "code" });

    if (error) {
      console.error(`  ❌ DB insert falhou:`, error.message);
      failed++;
    } else {
      console.log(`  💾 Salvo no banco!`);
      success++;
    }

    // Pequena pausa para não sobrecarregar o servidor de origem
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n✨ Seed concluído!`);
  console.log(`   ✅ ${success} produtos inseridos/atualizados`);
  if (failed > 0) console.log(`   ❌ ${failed} produtos com erro`);
}

main().catch((e) => {
  console.error("Erro fatal:", e);
  process.exit(1);
});
