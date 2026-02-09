"use client";

import { useAsyncAction } from "./useAsync";
import { useCallback } from "react";
import { getCompany } from "@/services/company.service";
import type { CompanyResponse } from "@/types/company";

export function useCompanyProfile() {
  const { run, loading } = useAsyncAction<CompanyResponse>();

  const fetchProfile = useCallback(() => run(() => getCompany()), [run]);

  return { fetchProfile, loading };
}
