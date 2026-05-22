"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gem, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
    setLoading(false);
    if (error) {
      toast.error("E-mail ou senha incorretos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] mb-4">
            <Gem className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Área Administrativa</h1>
          <p className="text-white/50 mt-2 text-sm">Acesso exclusivo para a Giselle</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="E-mail"
              {...register("email")}
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Senha"
              {...register("password")}
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition pr-12"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
