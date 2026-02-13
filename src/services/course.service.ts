import { api } from "@/lib/api";
import { ICourse } from "@/types/course";

export type CourseListResponse = {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: ICourse[];
};

export type CourseCreatePayloadData = {
  name: string;
  description: string;
  duration?: number | string | null;
  fees?: number | string | null;
  placement_gurantee?: boolean;
};

export type CourseCreatePayload = FormData | CourseCreatePayloadData;

export type CourseUpdatePayload = {
  courseId: string;
  patchData: FormData | Partial<CourseCreatePayloadData>;
};

export type CourseMutationResponse = {
  message?: string;
  data?: ICourse | null;
} & Partial<ICourse>;

export const getCourses = (page = 1, perPage = 10, searchTerm?: string) => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";

  return api<CourseListResponse>(
    `/list_course/?per_page=${perPage}&page=${page}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getAllCourses = (searchTerm?: string) =>
  getCourses(1, -1, searchTerm);

/** Get single course by ID */
export const getCourseById = async (courseId: string): Promise<ICourse | null> => {
  try {
    const res = await api<{ data?: ICourse }>(`/list_course/?id=${encodeURIComponent(courseId)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res?.data) return res.data;
    // Fallback: search in all courses
    const all = await getAllCourses();
    return all.data.find((c) => c.id === courseId) ?? null;
  } catch {
    return null;
  }
};

export const createCourse = (payload: CourseCreatePayload) => {
  const isFormData = payload instanceof FormData;
  return api<CourseMutationResponse>("create_course/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });
};

export const updateCourse = ({ courseId, patchData }: CourseUpdatePayload) => {
  const isFormData = patchData instanceof FormData;
  return api<CourseMutationResponse>(`/update_course/${courseId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    body: isFormData ? patchData : JSON.stringify(patchData),
  });
};

export const deleteCourse = (courseId: string) =>
  api<CourseMutationResponse>(`/delete_course/${courseId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

// --- Public Top Courses APIs ---

export interface TopCourseItem {
  id: number;
  name: string;
  course_category?: string | null;
  category_id?: number | null;
}

export interface TopCoursesResponse {
  data: TopCourseItem[];
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://inter.malspy.com";

/** Get top certification courses (public, no auth) */
export async function getTopCertificationCourses(): Promise<TopCourseItem[]> {
  const res = await fetch(`${BASE}/top_certification_course/`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load certification courses: ${res.status}`);
  }
  const json = (await res.json()) as TopCoursesResponse;
  return Array.isArray(json?.data) ? json.data : [];
}

/** Get top placement guarantee courses (public, no auth) */
export async function getTopPlacementGuaranteeCourses(): Promise<TopCourseItem[]> {
  const res = await fetch(`${BASE}/top_placement_gaurentee_courses/`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load placement guarantee courses: ${res.status}`);
  }
  const json = (await res.json()) as TopCoursesResponse;
  return Array.isArray(json?.data) ? json.data : [];
}

// --- Course Category List API ---

export interface CourseCategoryItem {
  id: number;
  name: string;
  title: string;
  description: string;
  course_owner: number;
  owner_name: string;
  fee: string;
  image: string | null;
  is_placement_gurantee: boolean;
  updated_at: string;
}

export interface CourseCategoryListResponse {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: CourseCategoryItem[];
}

/** Get course category list */
export async function getCourseCategoryList(): Promise<CourseCategoryListResponse> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/course_category_list/`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load courses: ${res.status}`);
  }

  const json = (await res.json()) as CourseCategoryListResponse;
  return json;
}

// --- Single Course Category (Detail) API ---

export interface CourseCategoryDetailItem {
  id: number;
  name: string;
  title: string;
  description: string;
  course_owner: number;
  owner_name: string;
  fee: string;
  image: string | null;
  is_placement_gurantee: boolean;
  what_you_learn: string;
  requirement: string;
  detail: string;
  reason: string;
  for_who: string;
  created_at: string;
  updated_at: string;
}

export interface CourseCategoryDetailResponse {
  statusCode: number;
  message: string | null;
  data: CourseCategoryDetailItem;
}

/** Get single course category by ID (for detail page) */
export async function getCourseCategoryById(
  id: string
): Promise<CourseCategoryDetailItem | null> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/course_category_list/${encodeURIComponent(id)}/`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to load course: ${res.status}`);
  }

  const json = (await res.json()) as CourseCategoryDetailResponse;
  if (!json?.data) return null;
  return json.data;
}
