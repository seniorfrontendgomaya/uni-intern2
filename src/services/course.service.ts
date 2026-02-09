import { api } from "@/lib/api";
import { ICourse } from "@/types/course";

export type CourseListResponse = {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: ICourse[];
};

export const getCourses = (page = 1, perPage = 10) =>
  api<CourseListResponse>(`/list_course/?per_page=${perPage}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
