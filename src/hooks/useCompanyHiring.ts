"use client";

import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import {
  getCompanyHiringList,
  deleteCompanyHiring,
  updateCompanyHiring,
  createCompanyHiring,
  type CompanyHiringPayload,
} from "@/services/company-hiring.service";
import type { CompanyHiring } from "@/types/company-hiring";
import { useAsyncAction } from "./useAsync";

export function useCompanyHiringPaginated(
  perPage = 10,
  searchTerm = ""
) {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getCompanyHiringList(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<CompanyHiring>(fetchPage, perPage);
}

export function useDeleteCompanyHiring() {
  const { run, loading } = useAsyncAction<{
    statusCode: number;
    message: string;
    data: CompanyHiring | null;
  }>();

  const destroy = (id: number) => run(() => deleteCompanyHiring(id));

  return { delete: destroy, loading };
}

export function useUpdateCompanyHiring() {
  const { run, loading } = useAsyncAction<{
    statusCode: number;
    message: string;
    data: CompanyHiring | null;
  }>();

  const update = (id: number, payload: CompanyHiringPayload) =>
    run(() => updateCompanyHiring(id, payload));

  return { update, loading };
}

export function useCreateCompanyHiring() {
  const { run, loading } = useAsyncAction<{
    statusCode: number;
    message: string;
    data: CompanyHiring | null;
  }>();

  const create = (payload: CompanyHiringPayload) =>
    run(() => createCompanyHiring(payload));

  return { create, loading };
}
