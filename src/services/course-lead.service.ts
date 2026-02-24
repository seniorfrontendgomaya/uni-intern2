import { api } from "@/lib/api";

/** List item from GET /student_send_for_video_course_api/ (Course Lead for superadmin/company) */
export type CourseLeadItem = {
  id: number;
  student_name: string;
  admin_name: string | null;
  course: Array<{ id: number; name: string }>;
  description: string;
  admin_response: string | null;
  company_response?: string | null;
  /** "Draft" | "Approved" | "Rejected" */
  is_active?: boolean | string;
  /** ISO datetime e.g. "2026-02-24T11:38:22.621442Z" */
  created_at?: string;
};

export type CourseLeadListResponse = {
  statusCode?: number;
  message?: string;
  data?: CourseLeadItem[];
  hasNextPage?: boolean;
  next?: string | null;
  previous?: string | null;
  count?: number;
};

/** Paginated response for course lead list. */
export type CourseLeadPaginatedResponse = {
  statusCode?: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: CourseLeadItem[];
};

/**
 * GET /student_send_for_video_course_api/
 * Fetch course lead requests with pagination and search (superadmin or company role).
 */
export async function getCourseLeadRequestsPaginated(
  page = 1,
  perPage = 10,
  search?: string
): Promise<CourseLeadPaginatedResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("per_page", String(perPage));
  if (typeof search === "string" && search.trim() !== "") {
    params.set("search", search.trim());
  }
  const query = params.toString();
  const url = query ? `/student_send_for_video_course_api/?${query}` : "/student_send_for_video_course_api/";

  const raw = await api<CourseLeadListResponse>(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    },
  });

  const data = Array.isArray(raw?.data) ? raw.data : [];
  const count = raw?.count ?? data.length;
  const hasNextPage = raw?.hasNextPage ?? false;

  return {
    statusCode: raw?.statusCode ?? 200,
    hasNextPage,
    next: raw?.next ?? null,
    previous: raw?.previous ?? null,
    count,
    message: raw?.message ?? null,
    data,
  };
}

export type CourseLeadPatchPayload =
  | { is_active: "Approved" | "Rejected"; admin_response: string }
  | { is_active: "Approved" | "Rejected"; company_response: string };

export type CourseLeadPatchResponse = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

/**
 * PATCH /student_send_for_video_course_api/{id}/
 * Update course lead request (approve/reject) — superadmin only.
 */
export async function patchCourseLeadRequest(
  id: number,
  payload: CourseLeadPatchPayload
): Promise<CourseLeadPatchResponse> {
  return api<CourseLeadPatchResponse>(`/update_student_send_for_video_course_api/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
