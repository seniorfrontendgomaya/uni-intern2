import { getApiUrl } from "@/lib/api";

export type JobTypeFilter = "paid" | "both" | "unpaid";

function parseListResponse(json: { data?: unknown }): string[] {
  const arr = Array.isArray(json?.data) ? json.data : [];
  const names = arr
    .map((item: unknown) => (item && typeof item === "object" && "name" in item ? String((item as { name?: string }).name ?? "").trim() : ""))
    .filter((name) => name.length > 0);
  const seen = new Set<string>();
  return names.filter((name) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchTopLocations(jobType: JobTypeFilter): Promise<string[]> {
  const res = await fetch(getApiUrl("/top_locations/", { job_type: jobType }), { cache: "no-store" });
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: unknown };
  return parseListResponse(json);
}

export async function fetchTopProfile(jobType: JobTypeFilter): Promise<string[]> {
  const res = await fetch(getApiUrl("/top_profile/", { job_type: jobType }), { cache: "no-store" });
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: unknown };
  return parseListResponse(json);
}

export async function fetchTopCategory(jobType: JobTypeFilter): Promise<string[]> {
  const res = await fetch(getApiUrl("/top_catgory/", { job_type: jobType }), { cache: "no-store" });
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: unknown };
  return parseListResponse(json);
}

export async function fetchTopPlacementCourses(jobType: JobTypeFilter): Promise<string[]> {
  const res = await fetch(getApiUrl("/top_placement_courses/", { job_type: jobType }), { cache: "no-store" });
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: unknown };
  return parseListResponse(json);
}

export async function fetchAllMegamenuData(jobType: JobTypeFilter) {
  const [locations, profiles, categories, placements] = await Promise.all([
    fetchTopLocations(jobType),
    fetchTopProfile(jobType),
    fetchTopCategory(jobType),
    fetchTopPlacementCourses(jobType),
  ]);
  return { locations, profiles, categories, placements };
}
