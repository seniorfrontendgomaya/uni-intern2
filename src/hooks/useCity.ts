"use client";

import { usePaginated } from "./usePaginated";
import {
  CityCreatePayload,
  CityMutationResponse,
  CityUpdatePayload,
  createCity,
  deleteCity,
  getCities,
  updateCity,
} from "@/services/city.service";
import type { City } from "@/types/city";
import { useAsyncAction } from "./useAsync";
import { useCallback } from "react";

export function useCitiesPaginated(perPage = 10, searchTerm = "") {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getCities(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<City>(fetchPage, perPage);
}

export function useCity() {
  const { run, loading } = useAsyncAction<CityMutationResponse>();

  const create = (payload: CityCreatePayload) => run(() => createCity(payload));

  return { data: create, loading };
}

export function useUpdateCity() {
  const { run, loading } = useAsyncAction<CityMutationResponse>();

  const update = (payload: CityUpdatePayload) => run(() => updateCity(payload));

  return { data: update, loading };
}

export function useDeleteCity() {
  const { run, loading } = useAsyncAction<CityMutationResponse>();

  const destroy = (id: string) => run(() => deleteCity(id));

  return { data: destroy, loading };
}
