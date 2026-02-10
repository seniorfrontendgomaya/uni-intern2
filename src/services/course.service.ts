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

export const getCourses = (page = 1, perPage = 10, searchTerm?: string) => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";

  return api<CourseListResponse>(
    `/list_course/?per_page=${perPage}&page=${page}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getAllCourses = (searchTerm?: string) =>
  getCourses(1, -1, searchTerm);
