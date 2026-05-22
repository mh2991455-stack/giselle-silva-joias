import type { Metadata } from "next";
import { FavoritosClient } from "./FavoritosClient";

export const metadata: Metadata = {
  title: "Meus Favoritos",
  description: "Suas peças favoritas da Giselle Silva. Envie a lista pelo WhatsApp para fazer seu pedido.",
};

export default function FavoritosPage() {
  return <FavoritosClient />;
}
