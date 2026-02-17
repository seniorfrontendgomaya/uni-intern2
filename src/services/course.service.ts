import { api, apiBaseUrlNoSlash } from "@/lib/api";
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
  is_recomended?: boolean;
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

export const getCourses = (
  page = 1,
  perPage = 10,
  searchTerm?: string,
  placementGuarantee?: boolean
) => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";
  const placementParam =
    placementGuarantee === true
      ? "&placement_gurantee=true"
      : "&placement_gurantee=false";

  return api<CourseListResponse>(
    `/list_course/?per_page=${perPage}&page=${page}${placementParam}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getAllCourses = (searchTerm?: string, placementGuarantee?: boolean) =>
  getCourses(1, -1, searchTerm, placementGuarantee);

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


/** Get top certification courses (public, no auth) */
export async function getTopCertificationCourses(): Promise<TopCourseItem[]> {
  const res = await fetch(`${apiBaseUrlNoSlash}/top_certification_course/`, {
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
  const res = await fetch(`${apiBaseUrlNoSlash}/top_placement_gaurentee_courses/`, {
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
  const res = await fetch(`${apiBaseUrlNoSlash}/course_category_list/`, {
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

// --- Course Sub Category List (by category_id) ---

export interface CourseSubCategoryItem {
  id: number;
  name: string;
  description: string;
  course_category: number;
  total_duration: number;
  course_count: number;
  course_category_name: string;
  course_category_fee: number;
  course_category_image: string | null;
}

export interface CourseSubCategoryListResponse {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: CourseSubCategoryItem[];
}

/** Get course sub-category list by category_id (for student course listing) */
export async function getCourseSubCategoryList(
  categoryId: number
): Promise<CourseSubCategoryListResponse> {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${apiBaseUrlNoSlash}/course_sub_category_list/?category_id=${encodeURIComponent(categoryId)}`,
    {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to load subcategories: ${res.status}`);
  }

  const json = (await res.json()) as CourseSubCategoryListResponse;
  return json;
}

/** Get course sub-category list without filter (for default /courses and /student/courses) */
export async function getCourseSubCategoryListAll(): Promise<CourseSubCategoryListResponse> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBaseUrlNoSlash}/course_sub_category_list/`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load subcategories: ${res.status}`);
  }

  const json = (await res.json()) as CourseSubCategoryListResponse;
  return json;
}

// --- Course Detail List (by sub_category_id) ---

export interface CourseDetailListItem {
  id: number;
  name: string;
  description: string;
  duration: number;
  video: string | null;
  course_sub_category: number;
}

export interface CourseDetailListCategory {
  id: number;
  name: string;
  title: string;
  description: string;
  course_owner: number;
  owner_name: string;
  fee: number | string;
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

export interface CourseDetailListSubCategory {
  id: number;
  name: string;
  description: string;
  course_category: CourseDetailListCategory;
}

export interface CourseDetailListResponse {
  statusCode?: number;
  message?: string | null;
  data?: CourseDetailListItem[];
  course_sub_category?: CourseDetailListSubCategory;
}

/** Get course detail list by sub_category_id (param from card's course_category key) */
export async function getCourseDetailList(
  subCategoryId: number
): Promise<CourseDetailListResponse> {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${apiBaseUrlNoSlash}/user_course_detail_list/?sub_category_id=${encodeURIComponent(subCategoryId)}`,
    {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to load course details: ${res.status}`);
  }

  const json = (await res.json()) as CourseDetailListResponse;
  // console.log("course_detail_list response:", json);
  return json;
}

/** Get single course category by ID (for detail page) */
export async function getCourseCategoryById(
  id: string
): Promise<CourseCategoryDetailItem | null> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBaseUrlNoSlash}/course_category_list/${encodeURIComponent(id)}/`, {
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
