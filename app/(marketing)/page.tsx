import { AboutSection, ContactSection } from "@/components/landing/about-contact";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { PopularBooks } from "@/components/landing/popular-books";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProductFeatures } from "@/components/landing/product-features";
import { HeroSection } from "@/components/landing/hero-section";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <LandingNavbar />
      <main>
        <HeroSection />
        <PopularBooks />
        <ProductFeatures />
        <AboutSection />
        <PricingSection />
        <ContactSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
