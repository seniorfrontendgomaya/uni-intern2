import { api, apiBaseUrlNoSlash } from "@/lib/api";
import type { ReferralItem, ReferralListResponse } from "@/types/referral";

export type ReferralCheckResponse = {
  statusCode: number;
  message: string;
  data?: { referral_code_exist: boolean };
};

/** Check if a referral code exists. GET /user_check_api/?referral_code=XXX (public, no auth). */
export async function checkReferralCode(referralCode: string): Promise<ReferralCheckResponse> {
  const code = encodeURIComponent(String(referralCode).trim());
  const res = await fetch(
    `${apiBaseUrlNoSlash}/user_check_api/?referral_code=${code}`,
    { method: "GET", headers: { Accept: "application/json" } }
  );
  const json = (await res.json()) as ReferralCheckResponse;
  if (!res.ok) throw new Error(json?.message ?? "Failed to check referral code");
  return json;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
  };
}

/**
 * Fetch referral list from GET /referal_api_view/
 * Supports pagination (per_page, page) and search query param.
 */
export async function getReferrals(
  page = 1,
  perPage = 10,
  search?: string
): Promise<ReferralListResponse> {
  const params = new URLSearchParams();
  params.set("per_page", String(perPage));
  params.set("page", String(page));
  if (typeof search === "string" && search.trim() !== "") {
    params.set("search", search.trim());
  }
  const query = params.toString();
  const url = query ? `/referal_api_view/?${query}` : "/referal_api_view/";

  const raw = await api<ReferralListResponse | ReferralItem[]>(url, {
    method: "GET",
    headers: authHeaders(),
  });

  let data: ReferralItem[] = [];
  if (Array.isArray(raw)) {
    data = raw;
  } else if (Array.isArray((raw as ReferralListResponse)?.data)) {
    data = (raw as ReferralListResponse).data ?? [];
  }
  const count = Array.isArray(raw) ? data.length : (raw as ReferralListResponse)?.count ?? data.length;
  const hasNextPage = Array.isArray(raw) ? false : (raw as ReferralListResponse)?.hasNextPage ?? false;

  return {
    statusCode: Array.isArray(raw) ? 200 : (raw as ReferralListResponse)?.statusCode ?? 200,
    hasNextPage,
    next: Array.isArray(raw) ? null : (raw as ReferralListResponse)?.next ?? null,
    previous: Array.isArray(raw) ? null : (raw as ReferralListResponse)?.previous ?? null,
    count,
    message: Array.isArray(raw) ? null : (raw as ReferralListResponse)?.message ?? null,
    data,
  };
}

export type ReferralUpdateActiveResponse = {
  statusCode?: number;
  message?: string;
  data?: ReferralItem;
};

/**
 * Update referral active state: PATCH /referal_api_view/{student_id}/ with body { is_active }.
 */
export async function updateReferralActive(
  studentId: number,
  is_active: boolean
): Promise<ReferralUpdateActiveResponse> {
  return api<ReferralUpdateActiveResponse>(`/referal_api_view/${studentId}/`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_active }),
  });
}

export type OwnReferralCodeResponse = {
  statusCode?: number;
  message?: string;
  data?: {
    referral_code?: string;
    active?: boolean;
    is_active?: boolean;
    created?: string;
    updated?: string;
  };
};

/**
 * Fetch the current user's own referral code: GET /get_own_refferal_code_api/
 */
export async function getOwnReferralCode(): Promise<OwnReferralCodeResponse> {
  return api<OwnReferralCodeResponse>("/get_own_refferal_code_api/", {
    method: "GET",
    headers: authHeaders(),
  });
}

/** Item from GET /student_referral_list_api/ (current student's referred users). */
export type StudentReferralListItem = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  email?: string;
  mobile?: string | null;
  joined_date?: string;
};

export type StudentReferralListResponse = {
  statusCode?: number;
  hasNextPage?: boolean;
  next?: string | null;
  previous?: string | null;
  count?: number;
  message?: string | null;
  data?: StudentReferralListItem[];
};

/**
 * Fetch current student's referred users: GET /student_referral_list_api/
 */
export async function getStudentReferralList(): Promise<StudentReferralListResponse> {
  const raw = await api<StudentReferralListResponse>("/student_referral_list_api/", {
    method: "GET",
    headers: authHeaders(),
  });
  const data = Array.isArray(raw?.data) ? raw.data : [];
  return {
    statusCode: raw?.statusCode ?? 200,
    hasNextPage: raw?.hasNextPage ?? false,
    next: raw?.next ?? null,
    previous: raw?.previous ?? null,
    count: raw?.count ?? data.length,
    message: raw?.message ?? null,
    data,
  };
}
