import type {
  RecommendedCourseApiResponse,
  RecommendedCourseItem,
} from "@/types/recommended-course";
import type { CourseCard } from "@/types/course-card";

const BASE = "https://inter.malspy.com";

export interface RecommendedCourseApiItem {
  id: number;
  name: string;
  description: string;
  duration: number;
  fees: number;
  placement_gurantee: boolean;
  is_recomended: boolean;
  image: string | null;
}

export interface RecommendedCourseApiResponse {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: RecommendedCourseApiItem[];
}

export interface PlacementCourseApiItem {
  id: number;
  name: string;
  description: string;
  duration: number;
  fees: number;
  placement_gurantee: boolean;
  is_recomended: boolean;
  image: string | null;
}

export interface PlacementCourseApiResponse {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: PlacementCourseApiItem[];
}

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

/** Get recommended courses as CourseCard[] for landing page */
export async function getRecommendedCoursesForLanding(): Promise<CourseCard[]> {
  try {
    const url = `${BASE}/recommended_course_api/?is_recomended=True`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = (await res.json()) as RecommendedCourseApiResponse;
    const data = json.data ?? [];
    
    return data.map((course): CourseCard => ({
      id: String(course.id),
      name: course.name,
      title: course.name,
      provider: "",
      image: course.image ?? null,
      price:
        typeof course.fees === "number"
          ? course.fees
          : parseFloat(String(course.fees)) || 0,
      description: course.description,
      duration: course.duration,
    }));
  } catch {
    return [];
  }
}

/** Get certification courses as CourseCard[] for landing page */
export async function getCertificationCoursesForLanding(): Promise<CourseCard[]> {
  try {
    const url = `${BASE}/recommended_course_api/`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = (await res.json()) as RecommendedCourseApiResponse;
    const data = json.data ?? [];
    
    return data.map((course): CourseCard => ({
      id: String(course.id),
      name: course.name,
      title: course.name,
      provider: "",
      image: course.image ?? null,
      price:
        typeof course.fees === "number"
          ? course.fees
          : parseFloat(String(course.fees)) || 0,
      description: course.description,
      duration: course.duration,
    }));
  } catch {
    return [];
  }
}

/** Get placement guarantee courses as CourseCard[] for landing page */
export async function getPlacementCoursesForLanding(): Promise<CourseCard[]> {
  try {
    const url = `${BASE}/recommended_course_api/?is_placement_course=true`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = (await res.json()) as PlacementCourseApiResponse;
    const data = json.data ?? [];
    
    return data.map((course): CourseCard => ({
      id: String(course.id),
      name: course.name,
      title: course.name,
      provider: "",
      image: course.image ?? null,
      price:
        typeof course.fees === "number"
          ? course.fees
          : parseFloat(String(course.fees)) || 0,
      description: course.description,
      duration: course.duration,
    }));
  } catch {
    return [];
  }
}
