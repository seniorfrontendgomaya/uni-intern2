"use client";

import { useCallback, useEffect, useState } from "react";
import { useAsyncAction } from "./useAsync";

export type PaginatedResponse<T> = {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: T[];
};

export type FetchPageFn<T> = (
  page: number,
  perPage: number
) => Promise<PaginatedResponse<T>>;

export function usePaginated<T>(
  fetchPage: FetchPageFn<T>,
  perPage = 10,
  initialPage = 1
) {
  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const { run, loading } = useAsyncAction<PaginatedResponse<T>>();

  const load = useCallback(
    async (targetPage = page) => {
      const res = await run(() => fetchPage(targetPage, perPage));
      if (res.ok && res.data) {
        setItems(res.data.data);
        setCount(res.data.count);
        setHasNext(res.data.hasNextPage);
        setHasPrev(Boolean(res.data.previous));
      } else {
        setItems([]);
        setCount(0);
        setHasNext(false);
        setHasPrev(false);
      }
      return res;
    },
    [fetchPage, page, perPage, run]
  );

  useEffect(() => {
    load(page);
  }, [load, page]);

  return {
    items,
    page,
    setPage,
    perPage,
    count,
    hasNext,
    hasPrev,
    loading,
    refresh: () => load(page),
  };
}
