import { api } from "@/lib/api";

export type StudentSubscriptionListItem = {
  id: number;
  is_paid: boolean;
  is_subscription_cancelled?: boolean;
  payment_order_id: string | null;
  created_at: string;
  subscription_plan_name: string | null;
  subcription_plan_type: string | null;
  subscription_plan_price: number | null;
};

export type StudentSubscriptionListResponse = {
  statusCode?: number;
  message?: string | null;
  data?: StudentSubscriptionListItem[];
  count?: number;
  hasNextPage?: boolean;
  next?: string | null;
  previous?: string | null;
};

export type CancelInternshipSubscriptionResponse = {
  statusCode?: number;
  message?: string | null;
  data?: unknown;
};

/**
 * GET subcription_list_api/?is_user=true
 * Fetch internship subscription list for the logged-in student (pagination + search).
 */
export async function getStudentSubscriptionsPaginated(
  page = 1,
  perPage = 10,
  search?: string
): Promise<{
  statusCode: number;
  message: string | null;
  data: StudentSubscriptionListItem[];
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
  const url = `/subcription_list_api/?${query}`;

  const raw = await api<StudentSubscriptionListResponse>(url, {
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
 * PATCH cancel_subscription/
 * Cancel an internship subscription for the logged-in student.
 */
export async function cancelStudentInternshipSubscription(
  subscriptionId: number
): Promise<CancelInternshipSubscriptionResponse> {
  return api<CancelInternshipSubscriptionResponse>("/cancel_subscription/", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${
        typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""
      }`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription_id: subscriptionId,
    }),
  });
}


