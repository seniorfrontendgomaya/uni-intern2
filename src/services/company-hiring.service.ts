import { api } from "@/lib/api";
import type {
  CompanyHiring,
  CompanyHiringListResponse,
  CompanyHiringMutationResponse,
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

export const deleteCompanyHiring = (id: number) =>
  api<CompanyHiringMutationResponse>(`/company_hiring_api/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const updateCompanyHiring = (
  id: number,
  payload: {
    description?: string | null;
    location?: number[];
    category?: number[];
    start_amount?: number | null;
    end_amount?: number | null;
    start_day?: string | null;
    active?: boolean;
    placement_gurantee_course?: boolean;
    number_of_opening?: number | null;
    is_fast_response?: boolean;
  }
) =>
  api<CompanyHiringMutationResponse>(`/company_hiring_api/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const createCompanyHiring = (payload: {
  description?: string | null;
  location?: number[];
  category?: number[];
  start_amount?: number | null;
  end_amount?: number | null;
  start_day?: string | null;
  active?: boolean;
  placement_gurantee_course?: boolean;
  number_of_opening?: number | null;
  is_fast_response?: boolean;
}) =>
  api<CompanyHiringMutationResponse>(`/company_hiring_api/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
