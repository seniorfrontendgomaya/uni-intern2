"use client";

import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import { useAsyncAction } from "./useAsync";
import {
  VideoSubcategoryCreatePayload,
  VideoSubcategoryUpdatePayload,
  createVideoSubcategory,
  deleteVideoSubcategory,
  getVideoSubcategories,
  updateVideoSubcategory,
} from "@/services/video-subcategory.service";
import type {
  VideoSubcategory,
  VideoSubcategoryMutationResponse,
} from "@/types/video-subcategory";

export function useVideoSubcategoriesPaginated(
  perPage = 10,
  categoryId: string
) {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getVideoSubcategories(page, limit, categoryId),
    [categoryId]
  );

  return usePaginated<VideoSubcategory>(fetchPage, perPage);
}

export function useVideoSubcategory() {
  const { run, loading } =
    useAsyncAction<VideoSubcategoryMutationResponse>();

  const create = (payload: VideoSubcategoryCreatePayload) =>
    run(() => createVideoSubcategory(payload));

  return { data: create, loading };
}

export function useUpdateVideoSubcategory() {
  const { run, loading } =
    useAsyncAction<VideoSubcategoryMutationResponse>();

  const update = (payload: VideoSubcategoryUpdatePayload) =>
    run(() => updateVideoSubcategory(payload));

  return { data: update, loading };
}

export function useDeleteVideoSubcategory() {
  const { run, loading } =
    useAsyncAction<VideoSubcategoryMutationResponse>();

  const destroy = (id: string) => run(() => deleteVideoSubcategory(id));

  return { data: destroy, loading };
}

