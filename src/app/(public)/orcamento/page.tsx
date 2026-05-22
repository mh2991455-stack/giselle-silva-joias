import type { Metadata } from "next";
import { OrcamentoClient } from "./OrcamentoClient";

export const metadata: Metadata = {
  title: "Orçamento",
  description: "Monte seu orçamento de joias e semijoias e envie direto para a Giselle pelo WhatsApp.",
};

export default function OrcamentoPage() {
  return <OrcamentoClient />;
}
