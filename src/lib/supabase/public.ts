import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/** Client sem cookies — use em generateStaticParams e fora do contexto HTTP */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
