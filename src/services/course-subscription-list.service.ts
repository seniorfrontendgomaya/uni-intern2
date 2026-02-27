import { api } from "@/lib/api";

export type CourseSubscriptionListItem = {
  id: number;
  full_name: string | null;
  email: string | null;
  mobile: string | null;
  course_name: string | null;
  fees: number | null;
  is_paid: boolean;
  created_at: string;
  payment_order_id?: string | null;
};

export type CourseSubscriptionListResponse = {
  statusCode?: number;
  message?: string | null;
  data?: CourseSubscriptionListItem[];
  count?: number;
  hasNextPage?: boolean;
  next?: string | null;
  previous?: string | null;
};

/**
 * GET course_subcription_list_api/?is_admin=true
 * Fetch course subscription list with pagination and search (superadmin).
 */
export async function getCourseSubscriptionListPaginated(
  page = 1,
  perPage = 10,
  search?: string
): Promise<{
  statusCode: number;
  message: string | null;
  data: CourseSubscriptionListItem[];
  count: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
}> {
  const params = new URLSearchParams();
  params.set("is_admin", "true");
  params.set("page", String(page));
  params.set("per_page", String(perPage));
  if (typeof search === "string" && search.trim() !== "") {
    params.set("search", search.trim());
  }
  const query = params.toString();
  const url = `/course_subcription_list_api/?${query}`;

  const raw = await api<CourseSubscriptionListResponse>(url, {
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
    message: raw?.message ?? null,
    data,
    count,
    hasNextPage,
    next: raw?.next ?? null,
    previous: raw?.previous ?? null,
  };
}
