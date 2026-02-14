import { LandingHeader } from "@/components/ui/landing-header";
import { FooterClientMount } from "@/components/ui/landing-footer";
import { InternshipListSkeleton } from "@/components/ui/internship-list-skeleton";

export default function InternshipsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <InternshipListSkeleton />
      </main>
      <FooterClientMount />
    </div>
  );
}
