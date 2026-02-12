import type {
  RecommendedCourseApiResponse,
  RecommendedCourseItem,
} from "@/types/recommended-course";

const BASE = "https://inter.malspy.com";

function mapEntryToItem(entry: { name?: string; course?: { name?: string }[]; start_anual_salary?: number | string | null; end_anual_salary?: number | string | null }, index: number): RecommendedCourseItem {
  const name = entry.name ?? "";
  const courseList = entry.course ?? [];
  const courses = courseList.map((c) => c.name ?? "").filter(Boolean);
  return {
    id: `rec-${index}-${name.replace(/\s+/g, "-").toLowerCase()}`,
    company: name,
    courses,
    salaryStart: entry.start_anual_salary ?? null,
    salaryEnd: entry.end_anual_salary ?? null,
  };
}

async function fetchRecommended(params: string): Promise<RecommendedCourseItem[]> {
  const url = `${BASE}/recommended_course_api/?${params}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = (await res.json()) as RecommendedCourseApiResponse;
  const data = json.data ?? [];
  return data.map((entry, i) => mapEntryToItem(entry, i));
}

/** Recommended for you (is_recomended=True) */
export function getRecommendedForYou() {
  return fetchRecommended("is_recomended=True");
}

/** Certification courses (is_placement_course=false) */
export function getCertificationCourses() {
  return fetchRecommended("is_placement_course=false");
}

/** Placement guarantee courses (is_placement_course=true) */
export function getPlacementGuaranteeCourses() {
  return fetchRecommended("is_placement_course=true");
}
