import type { TopCourseItem } from "@/services/course.service";
import {
  getTopCertificationCourses,
  getTopPlacementGuaranteeCourses,
} from "@/services/course.service";

export type CourseMegamenuData = {
  certification: TopCourseItem[];
  placement: TopCourseItem[];
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let cached: { data: CourseMegamenuData; ts: number } | null = null;

function getCached(): CourseMegamenuData | null {
  if (!cached || Date.now() - cached.ts > CACHE_TTL_MS) return null;
  return cached.data;
}

function setCached(data: CourseMegamenuData) {
  cached = { data, ts: Date.now() };
}

/**
 * Fetches course megamenu data (certification + placement); uses in-memory cache
 * so the path/URLs for the megamenu are cached and we avoid refetching on every open.
 */
export async function fetchCourseMegamenuData(): Promise<CourseMegamenuData> {
  const existing = getCached();
  if (existing) return existing;
  const [certification, placement] = await Promise.all([
    getTopCertificationCourses(),
    getTopPlacementGuaranteeCourses(),
  ]);
  const data: CourseMegamenuData = { certification, placement };
  setCached(data);
  return data;
}
