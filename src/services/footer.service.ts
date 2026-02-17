import { apiBaseUrl } from "@/lib/api";

export type FooterLink = { label: string; href: string };

const BASE = apiBaseUrl.replace(/\/$/, "");

/** Preserve literal + in query values (URLSearchParams decodes + as space). */
function normalizeQueryString(query: string): string {
  return query.replace(/\+/g, "%2B");
}

function getParamFromUrl(urlStr: string, param: string): string | null {
  if (!urlStr || typeof urlStr !== "string") return null;
  try {
    const idx = urlStr.indexOf("?");
    const raw = idx >= 0 ? urlStr.slice(idx + 1) : "";
    const params = new URLSearchParams(normalizeQueryString(raw));
    const value = params.get(param);
    return value ? decodeURIComponent(value).trim() || null : null;
  } catch {
    return null;
  }
}

function titleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

function extractLocation(item: { url?: string; title?: string }): FooterLink | null {
  let location: string | null = getParamFromUrl(item.url ?? "", "location");
  if (!location && item.title) {
    const m = item.title.match(/\bin\s+(.+?)(?:\s*$|,|;)/i) || item.title.match(/\bin\s+(.+)/i);
    location = m ? m[1].trim() : null;
  }
  if (!location) return null;
  const label = `Internships in ${titleCase(location)}`;
  const href = `/internships?location=${encodeURIComponent(location)}`;
  return { label, href };
}

function extractSkill(item: { url?: string; title?: string }): FooterLink | null {
  let skill: string | null = getParamFromUrl(item.url ?? "", "skill");
  if (!skill && item.title) {
    const first = item.title.trim().split(/\s+/)[0];
    skill = first ? first.trim() : null;
  }
  if (!skill) return null;
  const label = `${titleCase(skill)} Internships`;
  const href = `/internships?skill=${encodeURIComponent(skill)}`;
  return { label, href };
}

function extractPlacementCourse(item: { url?: string; title?: string }): FooterLink | null {
  let value: string | null = getParamFromUrl(item.url ?? "", "placement_course");
  if (!value && item.title) value = item.title.trim() || null;
  if (!value) return null;
  const label = titleCase(value);
  const href = `/internships?placement_course=${encodeURIComponent(value)}`;
  return { label, href };
}

async function fetchFooterEndpoint<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${BASE}/${path}`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    } as RequestInit);
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: unknown };
    const arr = Array.isArray(json?.data) ? json.data : [];
    return arr as T[];
  } catch {
    return [];
  }
}

export async function getFooterLocations(): Promise<FooterLink[]> {
  const data = await fetchFooterEndpoint<{ url?: string; title?: string }>(
    "get_pre_top_location_api/"
  );
  const out: FooterLink[] = [];
  for (const item of data) {
    const link = extractLocation(item);
    if (link?.label) out.push(link);
  }
  return out;
}

export async function getFooterSkills(): Promise<FooterLink[]> {
  const data = await fetchFooterEndpoint<{ url?: string; title?: string }>(
    "get_top_pre_skill_api/"
  );
  const out: FooterLink[] = [];
  for (const item of data) {
    const link = extractSkill(item);
    if (link?.label) out.push(link);
  }
  return out;
}

export async function getFooterPlacementCourses(): Promise<FooterLink[]> {
  const data = await fetchFooterEndpoint<{ url?: string; title?: string }>(
    "get_top_pre_placement_course_api/"
  );
  const out: FooterLink[] = [];
  for (const item of data) {
    const link = extractPlacementCourse(item);
    if (link?.label) out.push(link);
  }
  return out;
}

type FooterData = {
  locations: FooterLink[];
  skills: FooterLink[];
};

let footerDataCache: Promise<FooterData> | null = null;

/** Dedupe and cache footer API calls so they don't loop when footer remounts or re-renders. */
export async function getFooterData(): Promise<FooterData> {
  if (footerDataCache) return footerDataCache;
  footerDataCache = (async () => {
    const [locations, skills] = await Promise.all([
      getFooterLocations(),
      getFooterSkills(),
    ]);
    return { locations, skills };
  })();
  return footerDataCache;
}
