"use client";

import { useCallback, useEffect, useState } from "react";
import { useAsyncAction } from "./useAsync";
import {
  VideoCourseDetailCreatePayload,
  VideoCourseDetailUpdatePayload,
  createVideoCourseDetail,
  deleteVideoCourseDetail,
  getVideoCourseDetails,
  updateVideoCourseDetail,
} from "@/services/video-course-detail.service";
import type {
  VideoCourseDetail,
  VideoCourseDetailListResponse,
  VideoCourseDetailMutationResponse,
} from "@/types/video-course-detail";

export function useVideoCourseDetails(subCategoryId: string) {
  const [items, setItems] = useState<VideoCourseDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const { run } = useAsyncAction<VideoCourseDetailListResponse>();

  const load = useCallback(async () => {
    if (!subCategoryId) {
      setItems([]);
      return;
    }
    setLoading(true);
    const res = await run(() => getVideoCourseDetails(subCategoryId));
    setLoading(false);
    if (res.ok && res.data) {
      setItems(res.data.data);
    } else {
      setItems([]);
    }
    return res;
  }, [run, subCategoryId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    items,
    loading,
    refresh: load,
  };
}

export function useVideoCourseDetailCreate() {
  const { run, loading } =
    useAsyncAction<VideoCourseDetailMutationResponse>();

  const create = (payload: VideoCourseDetailCreatePayload) =>
    run(() => createVideoCourseDetail(payload));

  return { create, loading };
}

export function useVideoCourseDetailUpdate() {
  const { run, loading } =
    useAsyncAction<VideoCourseDetailMutationResponse>();

  const update = (payload: VideoCourseDetailUpdatePayload) =>
    run(() => updateVideoCourseDetail(payload));

  return { update, loading };
}

export function useVideoCourseDetailDelete() {
  const { run, loading } =
    useAsyncAction<VideoCourseDetailMutationResponse>();

  const destroy = (id: string) => run(() => deleteVideoCourseDetail(id));

  return { destroy, loading };
}

