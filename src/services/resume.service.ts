import { api } from "@/lib/api";
import { ResumeListResponse } from "@/types/resume";

export const getResumeList = (page = 1, perPage = 10) =>
  api<ResumeListResponse>(`/resume_list_api/?per_page=${perPage}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
