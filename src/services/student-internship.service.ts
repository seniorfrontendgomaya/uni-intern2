import { api, getApiUrl } from "@/lib/api";

export type GetCompanyQuery = {
  designation?: string;
  location?: string;
  category?: string;
  course?: string;
  job_type?: string;
  salary_range?: string;
};

/** Item shape from get_company/ API (note: API returns "comapany" typo). */
export interface GetCompanyItem {
  id: number;
  comapany: {
    id: number;
    name: string;
    image: string | null;
  };
  description: string | null;
  location: Array<{ id: number; name: string; description: string }>;
  category: Array<{ id: number; name: string; description?: string }>;
  job_type?: Array<{ id: number; name: string; description?: string; is_job_offer?: boolean }>;
  skills?: Array<{ id: number; name: string; description?: string }>;
  start_amount: number | null;
  end_amount: number | null;
  start_day: string | null;
  active: boolean;
  placement_gurantee_course: boolean;
  number_of_opening: number;
  is_fast_response: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetCompanyResponse {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: GetCompanyItem[];
}

/** Response shape from create_user_resume/ (apply for internship). */
export interface CreateUserResumeResponse {
  statusCode?: number;
  message?: string;
  data?: unknown;
}

/** Apply for an internship (company). POST create_user_resume/ with FormData. */
export async function applyForInternship(data: FormData): Promise<CreateUserResumeResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return api<CreateUserResumeResponse>("create_user_resume/", {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data,
  });
}

/** Fetch company list for student internship page. Used when coming from megamenu (e.g. ?designation=Marketing&job_type=paid). */
export async function fetchGetCompany(
  query: GetCompanyQuery
): Promise<GetCompanyResponse> {
  const params: Record<string, string> = {};
  if (query.designation?.trim()) params.designation = query.designation.trim();
  if (query.location?.trim()) params.location = query.location.trim();
  if (query.category?.trim()) params.category = query.category.trim();
  if (query.course?.trim()) params.course = query.course.trim();
  if (query.job_type?.trim()) params.job_type = query.job_type.trim();
  if (query.salary_range?.trim()) params.salary_range = query.salary_range.trim();

  const url = getApiUrl("get_company/", Object.keys(params).length ? params : undefined);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    return {
      statusCode: res.status,
      hasNextPage: false,
      next: null,
      previous: null,
      count: 0,
      message: null,
      data: [],
    };
  }
  return (await res.json()) as GetCompanyResponse;
}

/** Detail response shape from detail_company/{id}/ API. */
export interface DetailCompanyData {
  id: number;
  comapany: {
    id: number;
    name: string;
    image: string | null;
  };
  description: string | null;
  location: Array<{ id: number; name: string; description: string }>;
  category: Array<{ id: number; name: string; description?: string }>;
  job_type: Array<{ id: number; name: string; description?: string; is_job_offer?: boolean }>;
  designation: Array<{ id: number; name: string; description?: string }>;
  skills: Array<{ id: number; name: string; description?: string }>;
  course: Array<{
    id: number;
    name: string;
    description?: string;
    duration?: number;
    fees?: number;
    placement_gurantee?: boolean;
    image?: string | null;
  }>;
  perk: Array<{ id: number; name: string; description?: string }>;
  start_amount: number | null;
  end_amount: number | null;
  start_day: string | null;
  start_anual_salary: number | null;
  end_anual_salary: number | null;
  active: boolean;
  placement_gurantee_course: boolean;
  number_of_opening: number;
  about: string | null;
  apply: string | null;
  key_responsibility: string | null;
  apply_start_date: string | null;
  apply_end_date: string | null;
  is_fast_response: boolean;
  created_at: string;
  updated_at: string;
}

export interface DetailCompanyResponse {
  statusCode: number;
  message: string | null;
  data: DetailCompanyData;
}

/** Get company (employer) id from detail_company API data. Handles "comapany" or "company" key. Use this for create_user_resume "company" param. */
export function getCompanyIdFromDetailData(data: DetailCompanyData | Record<string, unknown>): string | null {
  const raw = data as Record<string, unknown>;
  const companyObj = (raw.comapany ?? raw.company) as { id?: number } | undefined;
  const id = companyObj?.id;
  return id != null ? String(id) : null;
}

/** Fetch single company/internship detail. */
export async function fetchDetailCompany(id: number): Promise<DetailCompanyResponse | null> {
  const url = getApiUrl(`detail_company/${id}/`);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) return null;
  return (await res.json()) as DetailCompanyResponse;
}

/** Display shape for company/internship detail (modal or detail page). */
export interface InternshipDetailDisplay {
  id: number;
  companyName: string;
  title: string;
  location: string;
  duration: string;
  dateRange: string;
  postedTime: string;
  isActivelyHiring: boolean;
  isEarlyApplicant: boolean;
  logo?: string;
  keyResponsibilities?: string;
  skillsRequired?: string[];
  howToApply?: string;
  perks?: string[];
  about?: string;
  description?: string;
  category?: string[];
  job_type?: string[];
  salaryRange?: string;
  active?: boolean;
  number_of_opening?: number;
}

function formatSalaryRange(start: number | null, end: number | null): string {
  if (start == null && end == null) return "";
  if (start != null && end != null) return `₹${(start / 1000).toFixed(0)}K - ₹${(end / 1000).toFixed(0)}K/month`;
  if (start != null) return `₹${(start / 1000).toFixed(0)}K+/month`;
  return end != null ? `Up to ₹${(end / 1000).toFixed(0)}K/month` : "";
}

/** Map detail_company API response to display shape. */
export function mapDetailToDisplay(detail: DetailCompanyData): InternshipDetailDisplay {
  const company = detail.comapany;
  const title = detail.designation?.map((d) => d.name).join(", ") ?? "";
  return {
    id: detail.id,
    companyName: company?.name ?? "",
    title,
    location: detail.location?.map((l) => l.name).join(", ") ?? "",
    duration: detail.start_day ?? "",
    dateRange: "",
    postedTime: "",
    isActivelyHiring: detail.is_fast_response,
    isEarlyApplicant: detail.is_fast_response,
    logo: company?.image ?? undefined,
    keyResponsibilities: detail.key_responsibility ?? undefined,
    skillsRequired: detail.skills?.map((s) => s.name) ?? [],
    howToApply: detail.apply ?? undefined,
    perks: detail.perk?.map((p) => p.name) ?? [],
    about: detail.about ?? undefined,
    description: detail.description ?? undefined,
    category: detail.category?.map((c) => c.name) ?? [],
    job_type: detail.job_type?.map((j) => j.name) ?? [],
    salaryRange: formatSalaryRange(detail.start_amount, detail.end_amount) || undefined,
    active: detail.active,
    number_of_opening: detail.number_of_opening,
  };
}
