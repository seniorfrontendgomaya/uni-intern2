"use client";

import { LandingHeader } from "@/components/ui/landing-header";
import { LandingFooter } from "@/components/ui/landing-footer";
import { InternshipPageContent } from "@/components/pages/internship-page";

export default function InternshipPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <InternshipPageContent />
      </main>
      <LandingFooter />
    </div>
  );
}
