import { api } from "@/lib/api";
import type {
  CompanyListResponse,
  CompanyMutationResponse,
} from "@/types/company-list";

export type CompanyCreatePayload = {
  name: string;
  email: string;
  mobile: string;
  password: string;
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
  start_day?: string;
  start_anual_salary: number;
  end_anual_salary: number;
  number_of_opening: number;
  about: string;
  apply: string;
  key_responsibility: string;
  apply_start_date?: string;
  apply_end_date?: string;
  qualification: string;
  education: string;
  user_type: string;
  active: boolean;
  placement_gurantee_course: boolean;
  is_fast_response?: boolean;
};

export type CompanyUpdatePayload = {
  companyId: string;
  patchData: Partial<Omit<CompanyCreatePayload, "user_type">>;
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

/** Dropdown company search: GET /dropdown_get_company_api/?search=... */
export type DropdownCompanyItem = { id: number | string; name: string };
export type DropdownCompanyResponse = { data?: DropdownCompanyItem[] } | DropdownCompanyItem[];

export async function getDropdownCompanies(search: string): Promise<DropdownCompanyItem[]> {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  const query = params.toString();
  const url = query ? `/dropdown_get_company_api/?${query}` : "/dropdown_get_company_api/";
  const raw = await api<DropdownCompanyResponse>(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (Array.isArray(raw)) return raw;
  const data = (raw as { data?: DropdownCompanyItem[] })?.data;
  return Array.isArray(data) ? data : [];
}

/** Dropdown courses by company: GET /dropdown_get_course_api/?company=... */
export type DropdownCourseItem = { id: number | string; name: string };
export type DropdownCourseResponse = { data?: DropdownCourseItem[] } | DropdownCourseItem[];

export async function getDropdownCourses(companyId: string | number): Promise<DropdownCourseItem[]> {
  const params = new URLSearchParams();
  params.set("company", String(companyId));
  const raw = await api<DropdownCourseResponse>(`/dropdown_get_course_api/?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (Array.isArray(raw)) return raw;
  const data = (raw as { data?: DropdownCourseItem[] })?.data;
  return Array.isArray(data) ? data : [];
}

/** Build minimal create payload from profile fields only (for superadmin simple create). */
export function minimalCompanyCreatePayload(values: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  description: string;
}): CompanyCreatePayload {
  return {
    user_type: "COMPANY",
    name: values.name,
    email: values.email,
    mobile: values.mobile,
    password: values.password,
    description: values.description,
    location: [],
    category: [],
    job_type: [],
    designation: [],
    skills: [],
    course: [],
    perk: [],
    start_amount: 0,
    end_amount: 0,
    start_anual_salary: 0,
    end_anual_salary: 0,
    number_of_opening: 0,
    about: "",
    apply: "",
    key_responsibility: "",
    qualification: "",
    education: "",
    active: true,
    placement_gurantee_course: false,
  };
}

export const createCompany = (payload: CompanyCreatePayload) =>
  api<CompanyMutationResponse>("create_company/", {
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

/** Profile fields + optional image file for superadmin company update. */
export type CompanyProfilePatch = {
  name?: string;
  email?: string;
  mobile?: string;
  description?: string;
  password?: string;
  image?: File | null;
};

/** PATCH update_company with FormData so image can be included. Only appends keys that are present (for update, send only changed fields). */
export const updateCompanyWithFormData = ({
  companyId,
  data,
}: {
  companyId: string;
  data: CompanyProfilePatch;
}) => {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.email !== undefined) formData.append("email", data.email);
  if (data.mobile !== undefined) formData.append("mobile", data.mobile);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.password != null && data.password !== "")
    formData.append("password", data.password);
  if (data.image instanceof File) {
    formData.append("image", data.image, data.image.name);
  }
  return api<CompanyMutationResponse>(`/update_company/${companyId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
};

export const getCompanyById = async (id: string): Promise<CompanyMutationResponse> => {
  return api<CompanyMutationResponse>(`/update_company/${id}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const deleteCompany = (companyId: string) =>
  api<CompanyMutationResponse>(`/delete_company/${companyId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
