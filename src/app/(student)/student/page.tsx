import { LandingHeroSection } from "@/components/ui/landing-hero-section";
import { LandingRecommendedSection } from "@/components/ui/landing-recommended-section";
import { LandingCertificationSection } from "@/components/ui/landing-certification-section";
import { LandingPlacementSection } from "@/components/ui/landing-placement-section";
import { LandingCompaniesSection } from "@/components/ui/landing-companies-section";
import { LandingTestimonialsSection } from "@/components/ui/landing-testimonials-section";

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-col">
      <LandingHeroSection />
      <LandingRecommendedSection />
      <LandingCertificationSection />
      <LandingPlacementSection />
      <LandingCompaniesSection />
      <LandingTestimonialsSection />
    </div>
  );
}


