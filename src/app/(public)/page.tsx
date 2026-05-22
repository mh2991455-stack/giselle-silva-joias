import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Marquee } from "@/components/ui/Marquee";
import { getFeaturedProducts, getNewProducts, getTestimonials, getSiteSettings } from "@/lib/supabase/queries";

export const revalidate = 3600;

export default async function HomePage() {
  const [featured, newArrivals, testimonials, settings] = await Promise.all([
    getFeaturedProducts(8),
    getNewProducts(6),
    getTestimonials(),
    getSiteSettings(),
  ]);

  return (
    <>
      <HeroSection settings={settings} />
      <Marquee />
      <FeaturedSection products={featured} />
      <AboutTeaser settings={settings} />
      <NewArrivalsSection products={newArrivals} />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
