"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function ToggleActiveButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();

  async function toggle() {
    const supabase = createClient();
    const { error } = await supabase.from("products").update({ is_active: !isActive } as never).eq("id", id);
    if (error) { toast.error("Erro ao atualizar."); return; }
    toast.success(isActive ? "Produto desativado." : "Produto ativado.");
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        isActive ? "text-gray-400 hover:text-orange-500 hover:bg-orange-50" : "text-gray-300 hover:text-green-600 hover:bg-green-50"
      }`}
      aria-label={isActive ? "Desativar" : "Ativar"}
    >
      {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </button>
  );
}
