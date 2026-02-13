"use client";

import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import { getUniversityStudents, bulkUploadUniversityStudents, deleteUniversityStudent, updateUniversityStudent } from "@/services/university-student.service";
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

export function useDeleteUniversityStudent() {
  const { run, loading } = useAsyncAction<{ statusCode: number; message: string; data: null }>();

  const destroy = (id: number) => run(() => deleteUniversityStudent(id));

  return { delete: destroy, loading };
}

export function useUpdateUniversityStudent() {
  const { run, loading } = useAsyncAction<{ statusCode: number; message: string; data: { id: number; email: string; mobile: string | null } }>();

  const update = (id: number, payload: { first_name?: string | null; last_name?: string | null; email?: string | null; mobile?: string | null }) =>
    run(() => updateUniversityStudent(id, payload));

  return { update, loading };
}

