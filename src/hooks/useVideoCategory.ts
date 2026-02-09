"use client";

import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import { useAsyncAction } from "./useAsync";
import {
  VideoCategoryCreatePayload,
  VideoCategoryUpdatePayload,
  createVideoCategory,
  deleteVideoCategory,
  getVideoCategories,
  updateVideoCategory,
} from "@/services/video-category.service";
import type {
  VideoCategory,
  VideoCategoryMutationResponse,
} from "@/types/video-category";

export function useVideoCategoriesPaginated(perPage = 10, searchTerm = "") {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getVideoCategories(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<VideoCategory>(fetchPage, perPage);
}

export function useVideoCategory() {
  const { run, loading } = useAsyncAction<VideoCategoryMutationResponse>();

  const create = (payload: VideoCategoryCreatePayload) =>
    run(() => createVideoCategory(payload));

  return { data: create, loading };
}

export function useUpdateVideoCategory() {
  const { run, loading } = useAsyncAction<VideoCategoryMutationResponse>();

  const update = (payload: VideoCategoryUpdatePayload) =>
    run(() => updateVideoCategory(payload));

  return { data: update, loading };
}

export function useDeleteVideoCategory() {
  const { run, loading } = useAsyncAction<VideoCategoryMutationResponse>();

  const destroy = (id: string) => run(() => deleteVideoCategory(id));

  return { data: destroy, loading };
}
