import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "E-mail inválido." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("newsletter").insert({ email: parsed.data.email } as never);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ ok: false, message: "Este e-mail já está cadastrado." });
      }
      return NextResponse.json({ ok: false, message: "Erro ao cadastrar." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Você está na lista! ✨" });
  } catch {
    return NextResponse.json({ ok: false, message: "Erro interno." }, { status: 500 });
  }
}
