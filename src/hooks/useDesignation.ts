"use client";

import { usePaginated } from "./usePaginated";
import {
  DesignationCreatePayload,
  DesignationListResponse,
  DesignationMutationResponse,
  DesignationUpdatePayload,
  createDesignation,
  deleteDesignation,
  getDesignations,
  updateDesignation,
} from "@/services/designation.service";
import { IDesignation } from "@/types/designation";
import { useAsyncAction } from "./useAsync";
import { useCallback } from "react";

export function useDesignationsPaginated(perPage = 10, searchTerm = "") {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getDesignations(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<IDesignation>(fetchPage, perPage);
}

export function useDesignation() {
  const { run, loading } = useAsyncAction<DesignationMutationResponse>();

  const create = (payload: DesignationCreatePayload) =>
    run(() => createDesignation(payload));

  return { data: create, loading };
}

export function useUpdateDesignation() {
  const { run, loading } = useAsyncAction<DesignationMutationResponse>();

  const update = (payload: DesignationUpdatePayload) =>
    run(() => updateDesignation(payload));

  return { data: update, loading };
}

export function useDeleteDesignation() {
  const { run, loading } = useAsyncAction<DesignationMutationResponse>();

  const destroy = (id: string) => run(() => deleteDesignation(id));

  return { data: destroy, loading };
}
