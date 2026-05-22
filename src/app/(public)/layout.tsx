import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { CartDrawer } from "@/components/product/CartDrawer";
import { LenisProvider } from "@/context/LenisContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>
        <LenisProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
          <CartDrawer />
          <Toaster position="bottom-right" richColors />
        </LenisProvider>
      </CartProvider>
    </WishlistProvider>
  );
}
