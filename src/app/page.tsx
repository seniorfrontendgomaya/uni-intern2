import { LandingHeader } from "@/components/ui/landing-header";
import { FooterSSR } from "@/components/ui/footer-ssr";
import { LandingHeroSection } from "@/components/ui/landing-hero-section";
import { LandingCompaniesSection } from "@/components/ui/landing-companies-section";
import { LandingRecommendedSection } from "@/components/ui/landing-recommended-section";
import { LandingCertificationSection } from "@/components/ui/landing-certification-section";
import { LandingPlacementSection } from "@/components/ui/landing-placement-section";
import { LandingTestimonialsSection } from "@/components/ui/landing-testimonials-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <LandingHeroSection />
      <LandingRecommendedSection />
      <LandingCertificationSection />
      <LandingPlacementSection />
      <LandingCompaniesSection />
      <LandingTestimonialsSection />
      <FooterSSR />
    </div>
  );
}
