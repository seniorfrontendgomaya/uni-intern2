import { api } from "@/lib/api";

export type StudentCourseSubscriptionItem = {
  id: number;
  course_request: number;
  user: number;
  user_name: string | null;
  user_email: string | null;
  user_mobile: string | null;
  admin_name: string | null;
  admin_email: string | null;
  is_paid: boolean;
  payment_order_id: string | null;
  course_name: string | null;
  course_fees: number | null;
  created_at: string;
  is_subscription_cancelled?: boolean;
};

export type StudentCourseSubscriptionResponse = {
  statusCode?: number;
  message?: string | null;
  data?: StudentCourseSubscriptionItem[];
  count?: number;
  hasNextPage?: boolean;
  next?: string | null;
  previous?: string | null;
};

export type CancelCourseSubscriptionResponse = {
  statusCode?: number;
  message?: string | null;
  data?: unknown;
};

/**
 * GET course_subcription_list_api/?is_user=true
 * Fetch course subscription list for the logged-in student (pagination + search).
 */
export async function getStudentCourseSubscriptionsPaginated(
  page = 1,
  perPage = 10,
  search?: string
): Promise<{
  statusCode: number;
  message: string | null;
  data: StudentCourseSubscriptionItem[];
  count: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
}> {
  const params = new URLSearchParams();
  params.set("is_user", "true");
  params.set("page", String(page));
  params.set("per_page", String(perPage));
  if (typeof search === "string" && search.trim() !== "") {
    params.set("search", search.trim());
  }
  const query = params.toString();
  const url = `/course_subcription_list_api/?${query}`;

  const raw = await api<StudentCourseSubscriptionResponse>(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${
        typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""
      }`,
    },
  });

  const data = Array.isArray(raw?.data) ? raw.data : [];
  const count = raw?.count ?? data.length;
  const hasNextPage = raw?.hasNextPage ?? false;

  return {
    statusCode: raw?.statusCode ?? 200,
    message: raw?.message ?? null,
    data,
    count,
    hasNextPage,
    next: raw?.next ?? null,
    previous: raw?.previous ?? null,
  };
}

/**
 * POST course_cancel_subscription_api/
 * Cancel a course subscription for the logged-in student.
 */
export async function cancelStudentCourseSubscription(
  courseRequestId: number
): Promise<CancelCourseSubscriptionResponse> {
  return api<CancelCourseSubscriptionResponse>("/course_cancel_subscription_api/", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${
        typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""
      }`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      course_request_id: courseRequestId,
    }),
  });
}


