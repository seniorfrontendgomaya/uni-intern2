import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import { useAsyncAction } from "./useAsync";
import {
  UniversityCreatePayload,
  UniversityUpdatePayload,
  createUniversity,
  deleteUniversity,
  getUniversities,
  updateUniversity,
} from "@/services/university.service";
import type {
  University,
  UniversityMutationResponse,
} from "@/types/university";

export function useUniversitiesPaginated(perPage = 10) {
  const fetchPage = useCallback(
    (page: number, limit: number) => getUniversities(page, limit),
    []
  );

  return usePaginated<University>(fetchPage, perPage);
}

export function useUniversity() {
  const { run, loading } = useAsyncAction<UniversityMutationResponse>();

  const create = (payload: UniversityCreatePayload) =>
    run(() => createUniversity(payload));

  return { data: create, loading };
}

export function useUpdateUniversity() {
  const { run, loading } = useAsyncAction<UniversityMutationResponse>();

  const update = (payload: UniversityUpdatePayload) =>
    run(() => updateUniversity(payload));

  return { data: update, loading };
}

export function useDeleteUniversity() {
  const { run, loading } = useAsyncAction<UniversityMutationResponse>();

  const destroy = (id: string) => run(() => deleteUniversity(id));

  return { data: destroy, loading };
}

