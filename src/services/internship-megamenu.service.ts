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

export type MegamenuData = {
  locations: string[];
  profiles: string[];
  categories: string[];
  placements: string[];
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache: Partial<Record<JobTypeFilter, { data: MegamenuData; ts: number }>> = {};

function getCached(jobType: JobTypeFilter): MegamenuData | null {
  const entry = cache[jobType];
  if (!entry || Date.now() - entry.ts > CACHE_TTL_MS) return null;
  return entry.data;
}

function setCached(jobType: JobTypeFilter, data: MegamenuData) {
  cache[jobType] = { data, ts: Date.now() };
}

/** Fetches megamenu data; uses in-memory cache per jobType to avoid calling APIs on every page/mount. */
export async function fetchAllMegamenuData(jobType: JobTypeFilter): Promise<MegamenuData> {
  const cached = getCached(jobType);
  if (cached) return cached;
  const [locations, profiles, categories, placements] = await Promise.all([
    fetchTopLocations(jobType),
    fetchTopProfile(jobType),
    fetchTopCategory(jobType),
    fetchTopPlacementCourses(jobType),
  ]);
  const data = { locations, profiles, categories, placements };
  setCached(jobType, data);
  return data;
}
