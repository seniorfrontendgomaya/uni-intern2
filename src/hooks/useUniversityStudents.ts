"use client";

import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import { getUniversityStudents, bulkUploadUniversityStudents } from "@/services/university-student.service";
import type { UniversityStudent } from "@/types/university-student";
import { useAsyncAction } from "./useAsync";

export function useUniversityStudentsPaginated(
  perPage = 10,
  searchTerm = ""
) {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getUniversityStudents(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<UniversityStudent>(fetchPage, perPage);
}

export function useBulkUploadUniversityStudents() {
  const { run, loading } = useAsyncAction<unknown>();

  const upload = (payload: FormData) =>
    run(() => bulkUploadUniversityStudents(payload));

  return { upload, loading };
}


