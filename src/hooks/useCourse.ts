"use client";

import { useCallback } from "react";
import { usePaginated } from "./usePaginated";
import { useAsyncAction } from "./useAsync";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse as updateCourseApi,
  type CourseCreatePayload,
  type CourseMutationResponse,
  type CourseUpdatePayload,
} from "@/services/course.service";
import { ICourse } from "@/types/course";

export function useCoursesPaginated(perPage = 10, searchTerm = "") {
  const fetchPage = useCallback(
    (page: number, limit: number) => getCourses(page, limit, searchTerm || undefined),
    [searchTerm]
  );

  return usePaginated<ICourse>(fetchPage, perPage);
}

export function useCreateCourse() {
  const { run, loading } = useAsyncAction<CourseMutationResponse>();

  const create = (payload: CourseCreatePayload) =>
    run(() => createCourse(payload));

  return { data: create, loading };
}

export function useUpdateCourse() {
  const { run, loading } = useAsyncAction<CourseMutationResponse>();

  const update = (payload: CourseUpdatePayload) =>
    run(() => updateCourseApi(payload));

  return { data: update, loading };
}

export function useDeleteCourse() {
  const { run, loading } = useAsyncAction<CourseMutationResponse>();

  const destroy = (courseId: string) => run(() => deleteCourse(courseId));

  return { data: destroy, loading };
}
