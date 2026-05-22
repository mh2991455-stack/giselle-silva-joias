import { cn } from "@/lib/utils/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark";
  hover?: boolean;
}

export function GlassCard({ children, className, variant = "light", hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border",
        variant === "light"
          ? "bg-white/80 backdrop-blur-xl border-white/30 shadow-[var(--shadow-glass)]"
          : "bg-black/30 backdrop-blur-xl border-white/10 shadow-[var(--shadow-glass)]",
        hover && "transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
