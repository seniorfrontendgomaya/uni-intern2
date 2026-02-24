import { api } from "@/lib/api";

/** List item for paid students (superadmin) used by the UI. */
export type PaidStudentItem = {
  id: number;
  name: string;
  mobile: string;
  email: string;
  total_credit: number;
  used_credit: number;
  /** Derived from API is_active (expired = !is_active). */
  expired: boolean;
};

/** Raw API response item from /user_credit/. */
type PaidStudentApiItem = {
  id: number;
  email: string;
  mobile: string;
  full_name: string;
  credit: number;
  is_active: boolean;
  used_credit: number;
};

export type PaidStudentsListResponse = {
  statusCode?: number;
  hasNextPage?: boolean;
  next?: string | null;
  previous?: string | null;
  count?: number;
  message?: string | null;
  data?: PaidStudentApiItem[];
};

/** Paginated response for paid students list. */
export type PaidStudentsPaginatedResponse = {
  statusCode?: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: PaidStudentItem[];
};

function mapApiItemToUi(item: PaidStudentApiItem): PaidStudentItem {
  return {
    id: item.id,
    name: item.full_name,
    mobile: item.mobile,
    email: item.email,
    total_credit: item.credit,
    used_credit: item.used_credit,
    expired: item.is_active === false,
  };
}

/**
 * GET /user_credit/
 * Fetch paid students list with pagination and search (superadmin).
 */
export async function getPaidStudentsPaginated(
  page = 1,
  perPage = 10,
  search?: string
): Promise<PaidStudentsPaginatedResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("per_page", String(perPage));
  if (typeof search === "string" && search.trim() !== "") {
    params.set("search", search.trim());
  }
  const query = params.toString();
  const url = query ? `/user_credit/?${query}` : "/user_credit/";

  const raw = await api<PaidStudentsListResponse>(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    },
  });

  const data = raw?.data;
  const items = Array.isArray(data) ? data.map(mapApiItemToUi) : [];
  const count = raw?.count ?? items.length;
  const hasNextPage = raw?.hasNextPage ?? false;

  return {
    statusCode: raw?.statusCode ?? 200,
    hasNextPage,
    next: raw?.next ?? null,
    previous: raw?.previous ?? null,
    count,
    message: raw?.message ?? null,
    data: items,
  };
}
