"use client";

import { usePaginated } from "./usePaginated";
import {
  PerkCreatePayload,
  PerkMutationResponse,
  PerkUpdatePayload,
  createPerk,
  deletePerk,
  getPerks,
  updatePerk,
} from "@/services/perk.service";
import { IPerk } from "@/types/perk";
import { useAsyncAction } from "./useAsync";
import { useCallback } from "react";

export function usePerksPaginated(perPage = 10, searchTerm = "") {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getPerks(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<IPerk>(fetchPage, perPage);
}

export function usePerk() {
  const { run, loading } = useAsyncAction<PerkMutationResponse>();

  const create = (payload: PerkCreatePayload) => run(() => createPerk(payload));

  return { data: create, loading };
}

export function useUpdatePerk() {
  const { run, loading } = useAsyncAction<PerkMutationResponse>();

  const update = (payload: PerkUpdatePayload) => run(() => updatePerk(payload));

  return { data: update, loading };
}

export function useDeletePerk() {
  const { run, loading } = useAsyncAction<PerkMutationResponse>();

  const destroy = (id: string) => run(() => deletePerk(id));

  return { data: destroy, loading };
}
