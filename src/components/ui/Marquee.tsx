"use client";

import { useRef } from "react";

interface MarqueeProps {
  text?: string;
  speed?: number;
  className?: string;
  bgClassName?: string;
  textClassName?: string;
}

const DEFAULT_TEXT =
  "FRETE GRÁTIS ACIMA DE R$ 199  ✦  PARCELAMOS EM 3X SEM JUROS  ✦  ENTREGA EM TODO O BRASIL  ✦  PEÇAS COM GARANTIA  ✦  WHATSAPP DIRETO COM A GISELLE  ✦  ";

export function Marquee({
  text = DEFAULT_TEXT,
  speed = 30,
  className = "",
  bgClassName = "bg-[var(--color-dark)]",
  textClassName = "text-white",
}: MarqueeProps) {
  const repeated = text.repeat(4);

  return (
    <div
      className={`overflow-hidden whitespace-nowrap py-2 ${bgClassName} ${className}`}
      aria-hidden="true"
    >
      <span
        className={`inline-block text-xs font-medium tracking-widest marquee-track ${textClassName}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {repeated}
        {repeated}
      </span>
    </div>
  );
}
