/**
 * Executa o schema SQL diretamente no banco Supabase via conexão PostgreSQL.
 *
 * Uso:
 *   DB_PASSWORD=suaSenhaAqui npx tsx supabase/run-schema.ts
 *
 * Para obter a senha do banco:
 *   Supabase Dashboard > Project Settings > Database > Connection string
 *   Copie a parte depois de "postgres:" e antes de "@db."
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { Client } from "pg";

async function main() {
  const password = process.env.DB_PASSWORD;
  if (!password) {
    console.error("❌ Erro: defina DB_PASSWORD com a senha do banco.");
    console.error("   Exemplo: DB_PASSWORD=minhaSenha npx tsx supabase/run-schema.ts");
    console.error("\n   Para obter a senha: Supabase Dashboard > Project Settings > Database > Connection string");
    process.exit(1);
  }

  const projectRef = "ytxriktsipizkirkbict";
  const client = new Client({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    user: "postgres",
    password,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  console.log(`\n🔗 Conectando ao banco Supabase (${projectRef})...`);
  await client.connect();
  console.log("✅ Conectado!\n");

  const schema = readFileSync(resolve(process.cwd(), "supabase/schema.sql"), "utf-8");

  console.log("📦 Executando schema SQL...");
  await client.query(schema);
  console.log("✅ Schema criado com sucesso!\n");

  await client.end();
  console.log("✨ Banco configurado! Execute agora:");
  console.log("   npm run seed\n");
}

main().catch((e) => {
  console.error("❌ Falha:", e.message);
  process.exit(1);
});
