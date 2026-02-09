import { api } from "@/lib/api";
import type {
  CompanyListResponse,
  CompanyMutationResponse,
} from "@/types/company-list";

export type CompanyCreatePayload = {
  name: string;
  email: string;
  mobile: string;
  description: string;
  location: string[];
  category: string[];
  job_type: string[];
  designation: string[];
  skills: string[];
  course: string[];
  perk: string[];
  start_amount: number;
  end_amount: number;
  start_day: string;
  start_anual_salary: number;
  end_anual_salary: number;
  number_of_opening: number;
  about: string;
  apply: string;
  key_responsibility: string;
  apply_start_date: string;
  apply_end_date: string;
  active: boolean;
  placement_gurantee_course: boolean;
  is_fast_response: boolean;
};

export type CompanyUpdatePayload = {
  companyId: string;
  patchData: Partial<CompanyCreatePayload>;
};

type CompanyListNormalized = CompanyListResponse & {
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  message: string | null;
};

export const getCompanies = async (
  page = 1,
  perPage = 10,
  searchTerm?: string
): Promise<CompanyListNormalized> => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";
  const raw = await api<CompanyListResponse>(
    `/list_company/?per_page=${perPage}&page=${page}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const hasNextPage = raw.count > page * perPage;
  return {
    ...raw,
    hasNextPage,
    next: hasNextPage ? "next" : null,
    previous: page > 1 ? "previous" : null,
    message: raw.message ?? null,
  };
};

export const searchCompanies = (searchTerm: string, page = 1, perPage = 10) =>
  getCompanies(page, perPage, searchTerm);

export const createCompany = (payload: CompanyCreatePayload) =>
  api<CompanyMutationResponse>("/create_company/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const updateCompany = ({ companyId, patchData }: CompanyUpdatePayload) =>
  api<CompanyMutationResponse>(`/update_company/${companyId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(patchData),
  });
