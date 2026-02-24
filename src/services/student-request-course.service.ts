import { api } from "@/lib/api";

export type StudentRequestVideoCoursePayload =
  | { is_superuser: true; course_ids: number[]; description: string }
  | { is_company: true; company: number; course_ids: number[]; description: string };

export type StudentRequestVideoCourseResponse = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

/** List item from GET /student_send_request_for_video_course_api/ */
export type StudentVideoCourseRequestItem = {
  id: number;
  student: number;
  company_name?: string | null;
  admin_name?: string | null;
  course: Array<{ id: number; name: string }>;
  description: string;
  /** Status from API (string): "Draft" | "Approved" | "Rejected". Draft is shown as "Pending". */
  is_active?: boolean | string;
  /** ISO datetime e.g. "2026-02-24T09:41:50.234831Z" */
  created_at?: string;
  updated_at?: string;
};

export type StudentVideoCourseRequestListResponse = {
  statusCode?: number;
  message?: string;
  data?: StudentVideoCourseRequestItem[];
};

/**
 * GET /student_send_request_for_video_course_api/
 * Fetch current student's video course requests.
 */
export async function getStudentVideoCourseRequests(): Promise<StudentVideoCourseRequestItem[]> {
  const raw = await api<StudentVideoCourseRequestListResponse>("/student_send_request_for_video_course_api/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    },
  });
  const data = (raw as StudentVideoCourseRequestListResponse)?.data;
  return Array.isArray(data) ? data : [];
}

/**
 * POST /student_send_request_for_video_course_api/
 * Submit a video course request (Superadmin or Company tab).
 */
export async function studentSendRequestForVideoCourse(
  payload: StudentRequestVideoCoursePayload
): Promise<StudentRequestVideoCourseResponse> {
  return api<StudentRequestVideoCourseResponse>("/student_send_request_for_video_course_api/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
