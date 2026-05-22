import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Giselle Silva | Joias & Semijoias",
    template: "%s | Giselle Silva",
  },
  description:
    "Joias e semijoias com estilo, qualidade e preço justo. Anéis, brincos, colares, pulseiras, argolas e muito mais. Atendimento direto pelo WhatsApp.",
  keywords: [
    "semijoias",
    "joias",
    "brincos",
    "colares",
    "pulseiras",
    "anéis",
    "argolas",
    "Giselle Silva",
    "joias banhadas",
    "semijoias Minas Gerais",
  ],
  authors: [{ name: "Giselle Silva" }],
  creator: "Giselle Silva",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Giselle Silva | Joias & Semijoias",
    title: "Giselle Silva | Joias & Semijoias",
    description:
      "Joias e semijoias com estilo, qualidade e preço justo. Atendimento direto pelo WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giselle Silva | Joias & Semijoias",
    description: "Joias e semijoias com estilo, qualidade e preço justo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "Giselle Silva Joias & Semijoias",
  description: "Joias e semijoias de qualidade com atendimento personalizado.",
  telephone: "+5531997969787",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+5531997969787",
    contactType: "customer service",
    availableLanguage: "Portuguese",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bricolage.variable} ${inter.variable} ${playfair.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
