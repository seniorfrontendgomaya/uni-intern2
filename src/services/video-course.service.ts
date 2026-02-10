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

function normalizeListPayload(raw: any): VideoCourse[] {
  if (Array.isArray(raw)) {
    return raw as VideoCourse[];
  }
  if (raw && Array.isArray(raw.data)) {
    return raw.data as VideoCourse[];
  }
  return [];
}

export const getVideoCourses = async (
  page = 1,
  perPage = 10
): Promise<VideoCourseListNormalized> => {
  const raw = await api<any>("/course_category_list/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const all = normalizeListPayload(raw);
  const count = all.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const data = all.slice(start, end);
  const hasNextPage = count > page * perPage;

  const base: VideoCourseListResponse = {
    statusCode: 200,
    count,
    data,
    message: raw?.message ?? null,
  };

  return {
    ...base,
    hasNextPage,
    next: hasNextPage ? "next" : null,
    previous: page > 1 ? "previous" : null,
    message: base.message ?? null,
  };
};

export const getVideoCourseById = async (
  id: string
): Promise<VideoCourse | null> => {
  const raw = await api<any>(`/course_category_list/${id}`, {
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

  return api<VideoCourseMutationResponse>("/course_category_list/", {
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
    `/update_course_category/${categoryId}/`,
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

