"use client";

import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import { useAsyncAction } from "./useAsync";
import {
  VideoCourseCreatePayload,
  VideoCourseUpdatePayload,
  createVideoCourse,
  deleteVideoCourse,
  getVideoCourses,
  getVideoCourseById,
  updateVideoCourse,
} from "@/services/video-course.service";
import type {
  VideoCourse,
  VideoCourseMutationResponse,
} from "@/types/video-course";

export function useVideoCoursesPaginated(perPage = 10, searchTerm = "") {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getVideoCourses(page, limit, searchTerm || undefined),
    [searchTerm]
  );

  return usePaginated<VideoCourse>(fetchPage, perPage);
}

export function useVideoCourse() {
  const { run, loading } = useAsyncAction<VideoCourseMutationResponse>();

  const create = (payload: VideoCourseCreatePayload) =>
    run(() => createVideoCourse(payload));

  return { data: create, loading };
}

export function useUpdateVideoCourse() {
  const { run, loading } = useAsyncAction<VideoCourseMutationResponse>();

  const update = (payload: VideoCourseUpdatePayload) =>
    run(() => updateVideoCourse(payload));

  return { data: update, loading };
}

export function useDeleteVideoCourse() {
  const { run, loading } = useAsyncAction<VideoCourseMutationResponse>();

  const destroy = (id: string) => run(() => deleteVideoCourse(id));

  return { data: destroy, loading };
}

export function useGetVideoCourseById() {
  const { run, loading } = useAsyncAction<VideoCourse | null>();

  const getById = (id: string) => run(() => getVideoCourseById(id));

  return { data: getById, loading };
}

