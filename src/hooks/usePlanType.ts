"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createPlanType,
  deletePlanType,
  getPlanTypes,
  updatePlanType,
} from "@/services/plan-type.service";
import type { PlanType } from "@/types/plan-type";
import { useAsyncAction } from "./useAsync";

const PER_PAGE_DEFAULT = 10;

export function usePlanTypesPaginated(perPage = PER_PAGE_DEFAULT, searchTerm = "") {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<PlanType[]>([]);
  const { run, loading } = useAsyncAction<{ data: PlanType[] }>();

  const load = useCallback(async () => {
    const res = await run(async () => {
      const raw = await getPlanTypes();
      return { data: raw.data ?? [] };
    });
    if (res.ok && res.data) setAllItems(res.data.data);
    else setAllItems([]);
    return res;
  }, [run]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = allItems.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return item.name?.toLowerCase().includes(term);
  });

  const count = filtered.length;
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);
  const hasNext = start + perPage < count;
  const hasPrev = page > 1;

  const patchItem = useCallback((updated: Partial<PlanType> & { id: number }) => {
    setAllItems((prev) =>
      prev.map((item) =>
        item.id === updated.id ? { ...item, ...updated } : item
      )
    );
  }, []);

  return {
    items,
    page,
    setPage,
    perPage,
    count,
    hasNext,
    hasPrev,
    loading,
    refresh: load,
    patchItem,
  };
}

export function useCreatePlanType() {
  const { run, loading } = useAsyncAction<{ message?: string }>();

  const create = (payload: { name: string; is_active?: boolean }) =>
    run(() => createPlanType(payload));

  return { data: create, loading };
}

export function useUpdatePlanType() {
  const { run, loading } = useAsyncAction<{ message?: string }>();

  const update = (payload: {
    planTypeId: string;
    patchData: { name?: string; is_active?: boolean };
  }) => run(() => updatePlanType(payload));

  return { data: update, loading };
}

export function useDeletePlanType() {
  const { run, loading } = useAsyncAction<{ message?: string }>();

  const destroy = (id: string) => run(() => deletePlanType(id));

  return { data: destroy, loading };
}
