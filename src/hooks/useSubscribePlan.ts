"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createSubscribePlan,
  deleteSubscribePlan,
  getSubscribePlans,
  updateSubscribePlan,
} from "@/services/subscribe-plan.service";
import type {
  SubscribePlanCreatePayload,
  SubscribePlanItem,
  SubscribePlanUpdatePayload,
} from "@/types/subscribe-plan";
import { useAsyncAction } from "./useAsync";

const PER_PAGE_DEFAULT = 10;

export function useSubscribePlansPaginated(
  perPage = PER_PAGE_DEFAULT,
  searchTerm = "",
  planTypeId?: string
) {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<SubscribePlanItem[]>([]);
  const { run, loading } = useAsyncAction<{ data: SubscribePlanItem[] }>();

  const load = useCallback(async () => {
    const res = await run(async () => {
      const raw = await getSubscribePlans(planTypeId);
      return { data: raw.data ?? [] };
    });
    if (res.ok && res.data) setAllItems(res.data.data);
    else setAllItems([]);
    return res;
  }, [run, planTypeId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = allItems.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      item.name?.toLowerCase().includes(term) ||
      item.plan_name?.toLowerCase().includes(term)
    );
  });

  const count = filtered.length;
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);
  const hasNext = start + perPage < count;
  const hasPrev = page > 1;

  const patchItem = useCallback((updated: Partial<SubscribePlanItem> & { id: number }) => {
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

export function useCreateSubscribePlan() {
  const { run, loading } = useAsyncAction<{ message?: string }>();

  const create = (payload: SubscribePlanCreatePayload) =>
    run(() => createSubscribePlan(payload));

  return { data: create, loading };
}

export function useUpdateSubscribePlan() {
  const { run, loading } = useAsyncAction<{ message?: string }>();

  const update = (payload: SubscribePlanUpdatePayload) =>
    run(() => updateSubscribePlan(payload));

  return { data: update, loading };
}

export function useDeleteSubscribePlan() {
  const { run, loading } = useAsyncAction<{ message?: string }>();

  const destroy = (id: string) => run(() => deleteSubscribePlan(id));

  return { data: destroy, loading };
}
