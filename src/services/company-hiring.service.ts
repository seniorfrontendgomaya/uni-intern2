import { api } from "@/lib/api";
import type {
  CompanyHiring,
  CompanyHiringListResponse,
  CompanyHiringMutationResponse,
  CompanyHiringDetailResponse,
} from "@/types/company-hiring";

export const getCompanyHiringList = async (
  page = 1,
  perPage = 10,
  searchTerm?: string
): Promise<CompanyHiringListResponse> => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";
  const raw = await api<CompanyHiringListResponse>(
    `/get_company_hiring_list/?page=${page}&per_page=${perPage}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return {
    statusCode: raw.statusCode ?? 200,
    data: raw.data ?? [],
    count: raw.count ?? 0,
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    hasNextPage: Boolean(raw.next),
    message: raw.message ?? null,
  };
};

/** Fetch single hiring detail (for view premium card) */
export const getCompanyHiringDetail = (id: number) =>
  api<CompanyHiringDetailResponse>(`/detail_company_hiring_list/${id}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const deleteCompanyHiring = (id: number) =>
  api<CompanyHiringMutationResponse>(`/company_hiring_api/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export type CompanyHiringPayload = {
  description?: string | null;
  about?: string | null;
  apply?: string | null;
  key_responsibility?: string | null;
  apply_start_date?: string | null;
  apply_end_date?: string | null;
  location?: number[];
  category?: number[];
  job_type?: number[];
  designation?: number[];
  skills?: number[];
  course?: number[];
  perk?: number[];
  start_amount?: number | null;
  end_amount?: number | null;
  start_anual_salary?: number | null;
  end_anual_salary?: number | null;
  start_day?: string | null;
  active?: boolean;
  placement_gurantee_course?: boolean;
  number_of_opening?: number | null;
  is_fast_response?: boolean;
};

export const updateCompanyHiring = (id: number, payload: CompanyHiringPayload) =>
  api<CompanyHiringMutationResponse>(`/update_company_hiring_list/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const createCompanyHiring = (payload: CompanyHiringPayload) =>
  api<CompanyHiringMutationResponse>(`create_company_hiring_list/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
