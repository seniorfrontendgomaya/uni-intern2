import { api } from "@/lib/api";
import type {
  VideoCourseDetail,
  VideoCourseDetailListResponse,
  VideoCourseDetailMutationResponse,
} from "@/types/video-course-detail";

export type VideoCourseDetailCreatePayload = FormData;

export type VideoCourseDetailUpdatePayload = {
  courseId: string;
  patchData:
    | FormData
    | Partial<{
        name: string;
        description: string;
        duration: string;
        course_sub_category: string | number;
        video: string;
      }>;
};

export const getVideoCourseDetails = async (
  subCategoryId: string
): Promise<VideoCourseDetailListResponse> => {
  const raw = await api<any>(
    `/course_detail_list/?sub_category_id=${encodeURIComponent(subCategoryId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (Array.isArray(raw)) {
    return {
      statusCode: 200,
      data: raw as VideoCourseDetail[],
      message: null,
    };
  }

  if (raw && Array.isArray(raw.data)) {
    return {
      statusCode: raw.statusCode ?? 200,
      data: raw.data as VideoCourseDetail[],
      message: raw.message ?? null,
    };
  }

  return {
    statusCode: raw?.statusCode ?? 500,
    data: [],
    message: raw?.message ?? "Failed to load courses",
  };
};

export const createVideoCourseDetail = (
  payload: VideoCourseDetailCreatePayload
) =>
  api<VideoCourseDetailMutationResponse>("/course_detail_list/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: payload,
  });

export const updateVideoCourseDetail = ({
  courseId,
  patchData,
}: VideoCourseDetailUpdatePayload) => {
  const isFormData =
    typeof FormData !== "undefined" && patchData instanceof FormData;

  return api<VideoCourseDetailMutationResponse>(
    `/update_course_detail/${courseId}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: isFormData ? patchData : JSON.stringify(patchData),
    }
  );
};

export const deleteVideoCourseDetail = (courseId: string) =>
  api<VideoCourseDetailMutationResponse>(
    `/update_course_detail/${courseId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

