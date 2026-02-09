"use client";

import { usePaginated } from "./usePaginated";
import { getCourses } from "@/services/course.service";
import { ICourse } from "@/types/course";

export function useCoursesPaginated(perPage = 10) {
  return usePaginated<ICourse>(getCourses, perPage);
}
