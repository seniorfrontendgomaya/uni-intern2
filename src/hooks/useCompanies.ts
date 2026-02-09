"use client";

import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import {
  CompanyCreatePayload,
  CompanyUpdatePayload,
  createCompany,
  getCompanies,
  updateCompany,
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
