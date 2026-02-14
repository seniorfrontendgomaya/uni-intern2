"use client";

import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import {
  CompanyCreatePayload,
  CompanyUpdatePayload,
  CompanyProfilePatch,
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  updateCompanyWithFormData,
} from "@/services/companies.service";
import type {
  CompanyListItem,
  CompanyMutationResponse,
} from "@/types/company-list";
import { useAsyncAction } from "./useAsync";

export function useCompaniesPaginated(perPage = 10, searchTerm = "") {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getCompanies(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<CompanyListItem>(fetchPage, perPage);
}

export function useCreateCompany() {
  const { run, loading } = useAsyncAction<CompanyMutationResponse>();

  const create = (payload: CompanyCreatePayload) => run(() => createCompany(payload));

  return { data: create, loading };
}

export function useUpdateCompany() {
  const { run, loading } = useAsyncAction<CompanyMutationResponse>();

  const update = (payload: CompanyUpdatePayload) => run(() => updateCompany(payload));

  return { data: update, loading };
}

export function useUpdateCompanyWithFormData() {
  const { run, loading } = useAsyncAction<CompanyMutationResponse>();

  const update = (payload: { companyId: string; data: CompanyProfilePatch }) =>
    run(() => updateCompanyWithFormData(payload));

  return { data: update, loading };
}

export function useGetCompanyById() {
  const { run, loading } = useAsyncAction<CompanyListItem | null>();

  const getById = useCallback(
    (id: string) =>
      run(async () => {
        // Fetch single company by ID using the update endpoint with GET method
        const response = await getCompanyById(id);
        // The API response might have the company in response.data.data or response.data
        return response.data || null;
      }),
    [run]
  );

  return { data: getById, loading };
}
