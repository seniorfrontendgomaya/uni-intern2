import { api } from "@/lib/api";
import type {
  VideoCourse,
  VideoCourseListResponse,
  VideoCourseMutationResponse,
} from "@/types/video-course";

export type VideoCourseCreatePayload =
  | FormData
  | {
      name: string;
      title: string;
      description?: string;
      fee?: number | string;
      is_placement_gurantee?: boolean;
      what_you_learn?: string;
      requirement?: string;
      detail?: string;
      reason?: string;
      for_who?: string;
      // image will be sent only when using FormData
    };

export type VideoCourseUpdatePayload = {
  categoryId: string;
  patchData:
    | FormData
    | Partial<{
        name: string;
        title: string;
        description: string;
        fee: number | string;
        is_placement_gurantee: boolean;
        what_you_learn: string;
        requirement: string;
        detail: string;
        reason: string;
        for_who: string;
        // image only via FormData
      }>;
};

type VideoCourseListNormalized = VideoCourseListResponse & {
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  message: string | null;
};

export const getVideoCourses = async (
  page = 1,
  perPage = 10
): Promise<VideoCourseListNormalized> => {
  // Use backend pagination instead of slicing on the client
  const raw = await api<any>(
    `/course_category_list/?per_page=${perPage}&page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data: VideoCourse[] = Array.isArray(raw?.data) ? raw.data : [];
  const count: number = typeof raw?.count === "number" ? raw.count : data.length;

  const hasNextPage: boolean =
    typeof raw?.hasNextPage === "boolean"
      ? raw.hasNextPage
      : count > page * perPage;

  return {
    statusCode: raw?.statusCode ?? 200,
    count,
    data,
    hasNextPage,
    next: (raw?.next as string | null) ?? (hasNextPage ? "next" : null),
    previous:
      (raw?.previous as string | null) ?? (page > 1 ? "previous" : null),
    message: raw?.message ?? null,
  };
};

export const getVideoCourseById = async (
  id: string
): Promise<VideoCourse | null> => {
  const raw = await api<any>(`course_category_list/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (raw && !Array.isArray(raw) && raw.id) {
    return raw as VideoCourse;
  }

  if (raw && Array.isArray(raw.data) && raw.data.length > 0) {
    return raw.data[0] as VideoCourse;
  }

  return null;
};

export const createVideoCourse = (payload: VideoCourseCreatePayload) => {
  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;

  return api<VideoCourseMutationResponse>("course_category_list/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });
};

export const updateVideoCourse = ({
  categoryId,
  patchData,
}: VideoCourseUpdatePayload) => {
  const isFormData =
    typeof FormData !== "undefined" && patchData instanceof FormData;

  return api<VideoCourseMutationResponse>(
    `update_course_category/${categoryId}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: isFormData ? patchData : JSON.stringify(patchData),
    }
  );
};

export const deleteVideoCourse = (categoryId: string) =>
  api<VideoCourseMutationResponse>(
    `/update_course_category/${categoryId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

