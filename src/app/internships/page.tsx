import { LandingHeader } from "@/components/ui/landing-header";
import { FooterClientMount } from "@/components/ui/landing-footer";
import { PublicInternshipListingSSR } from "@/components/pages/public-internship-listing-ssr";
import { fetchPublicInternships } from "@/services/public-internships.service";

const PAGE_SIZE = 10;

function getParam(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function PublicInternshipsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await searchParamsPromise;
  const page = Math.max(1, parseInt(getParam(searchParams.page) ?? "1", 10) || 1);
  const query = {
    location: getParam(searchParams.location),
    skill: getParam(searchParams.skill),
    profile: getParam(searchParams.profile),
    placement_course: getParam(searchParams.placement_course),
    page,
    page_size: PAGE_SIZE,
  };

  const data = await fetchPublicInternships(query);

  const searchParamsForLinks: Record<string, string | undefined> = {
    location: query.location,
    skill: query.skill,
    profile: query.profile,
    placement_course: query.placement_course,
    page: page > 1 ? String(page) : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PublicInternshipListingSSR
          items={data.data ?? []}
          count={data.count ?? 0}
          hasNextPage={data.hasNextPage ?? false}
          hasPreviousPage={!!data.previous}
          currentPage={page}
          searchParams={searchParamsForLinks}
        />
      </main>
      <FooterClientMount />
    </div>
  );
}
