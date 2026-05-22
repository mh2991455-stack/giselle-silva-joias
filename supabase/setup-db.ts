/**
 * Executa o schema SQL e cria os buckets no Supabase.
 * Uso: npx tsx supabase/setup-db.ts
 *
 * Usa conexão direta PostgreSQL via pooler do Supabase (Transaction mode, porta 6543).
 * A connection string é: postgres://postgres.[PROJECT_REF]:[DB_PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
 */

import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  try {
    const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {}
}

async function runViaRestAPI() {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const projectRef = url.replace("https://", "").replace(".supabase.co", "");

  console.log(`\n🔗 Projeto: ${projectRef}\n`);

  // Tentar Management API com o service key como bearer
  // (funciona se o usuário configurou custom JWT ou tem Management API access)
  const schema = readFileSync(resolve(process.cwd(), "supabase/schema.sql"), "utf-8");

  // Dividir SQL em statements executáveis individualmente via PostgREST
  // Para DDL precisamos de um endpoint especial — tentar via edge function ou outro approach

  console.log("\n✅ O schema SQL está pronto em: supabase/schema.sql");
  console.log("\n📋 Para executar no Supabase Dashboard:");
  console.log("   1. Acesse: https://supabase.com/dashboard/project/" + projectRef + "/sql/new");
  console.log("   2. Cole o conteúdo do arquivo supabase/schema.sql");
  console.log("   3. Clique em 'Run'\n");

  // Criar buckets via Storage API (isso SIM funciona com service_role)
  console.log("🪣 Criando buckets de storage...\n");

  for (const bucket of ["products", "testimonials"]) {
    const res = await fetch(`${url}/storage/v1/bucket`, {
      method: "POST",
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: bucket, name: bucket, public: true }),
    });
    const data = await res.json();
    if (res.ok || data.error === "Bucket already exists") {
      console.log(`  ✅ Bucket '${bucket}': OK`);
    } else {
      console.log(`  ⚠️  Bucket '${bucket}':`, data.error ?? data.message);
    }
  }

  console.log("\n✨ Setup de buckets concluído!");
  console.log("\n📌 Próximos passos:");
  console.log("   1. Execute o schema SQL no Supabase Dashboard (link acima)");
  console.log("   2. Crie o usuário admin em: Authentication > Users > Invite user");
  console.log("   3. Execute: npm run seed (para inserir os 72 produtos)");
}

runViaRestAPI().catch(console.error);
