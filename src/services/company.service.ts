import { api } from "@/lib/api";
import type { CompanyResponse } from "@/types/company";

export const getCompany = () =>
  api<CompanyResponse>("get_company_api/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
