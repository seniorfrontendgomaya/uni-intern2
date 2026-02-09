"use client";

import { usePaginated } from "./usePaginated";
import { getResumeList } from "@/services/resume.service";
import { ResumeListItem } from "@/types/resume";

export function useResumeListPaginated(perPage = 10) {
  return usePaginated<ResumeListItem>(getResumeList, perPage);
}
