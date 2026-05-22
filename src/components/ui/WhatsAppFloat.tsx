"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);
  const number = process.env.NEXT_PUBLIC_WHATSAPP ?? "5531997969787";

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com a Giselle pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      <span
        className={`absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--color-dark)] text-white text-sm px-3 py-1.5 rounded-full transition-all duration-200 ${
          hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        Fale com a Giselle
      </span>

      {/* Ping ring */}
      <span className="absolute inset-0 rounded-full bg-green-400 ping-pulse" />

      {/* Button */}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-green-500 shadow-lg hover:bg-green-600 transition-colors duration-200">
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </span>
    </a>
  );
}
