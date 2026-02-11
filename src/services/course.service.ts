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

export type CourseCreatePayload = {
  name: string;
  description: string;
  duration?: number | string | null;
  fees?: number | string | null;
  placement_gurantee?: boolean;
};

export type CourseUpdatePayload = {
  courseId: string;
  patchData: Partial<CourseCreatePayload>;
};

export type CourseMutationResponse = {
  message?: string;
  data?: ICourse | null;
} & Partial<ICourse>;

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

export const createCourse = (payload: CourseCreatePayload) =>
  api<CourseMutationResponse>("create_course/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const updateCourse = ({ courseId, patchData }: CourseUpdatePayload) =>
  api<CourseMutationResponse>(`/update_course/${courseId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(patchData),
  });

export const deleteCourse = (courseId: string) =>
  api<CourseMutationResponse>(`/delete_course/${courseId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
