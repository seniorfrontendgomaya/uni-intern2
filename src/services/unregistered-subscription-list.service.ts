import { api } from "@/lib/api";

export type UnregisteredSubscriptionListItem = {
  id: number;
  user_name: string | null;
  user_email: string | null;
  user_mobile: string | null;
  is_paid: boolean;
  payment_order_id: string | null;
  created_at: string;
  subscription_plan_name: string | null;
  subcription_plan_type: string | null;
  subscription_plan_price: number | null;
};

export type UnregisteredSubscriptionListResponse = {
  statusCode?: number;
  message?: string | null;
  data?: UnregisteredSubscriptionListItem[];
  count?: number;
  hasNextPage?: boolean;
  next?: string | null;
  previous?: string | null;
};

/**
 * GET subcription_list_api/?is_admin=true
 * Fetch unregistered subscription list with pagination and search (superadmin).
 */
export async function getUnregisteredSubscriptionListPaginated(
  page = 1,
  perPage = 10,
  search?: string
): Promise<{
  statusCode: number;
  message: string | null;
  data: UnregisteredSubscriptionListItem[];
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
  const url = `/subcription_list_api/?${query}`;

  const raw = await api<UnregisteredSubscriptionListResponse>(url, {
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

