import { api } from "@/lib/api";
import type {
  VideoCategoryListResponse,
  VideoCategoryMutationResponse,
} from "@/types/video-category";

export type VideoCategoryCreatePayload = FormData;

export type VideoCategoryUpdatePayload = {
  categoryId: string;
  patchData: FormData;
};

type VideoCategoryListNormalized = VideoCategoryListResponse & {
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  message: string | null;
};

export const getVideoCategories = async (
  page = 1,
  perPage = 10,
  searchTerm?: string
): Promise<VideoCategoryListNormalized> => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";
  const raw = await api<VideoCategoryListResponse>(
    `/course_category_list/?per_page=${perPage}&page=${page}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const hasNextPage = raw.count > page * perPage;
  return {
    ...raw,
    hasNextPage,
    next: hasNextPage ? "next" : null,
    previous: page > 1 ? "previous" : null,
    message: raw.message ?? null,
  };
};

export const searchVideoCategories = (
  searchTerm: string,
  page = 1,
  perPage = 10
) => getVideoCategories(page, perPage, searchTerm);

export const createVideoCategory = (payload: VideoCategoryCreatePayload) =>
  api<VideoCategoryMutationResponse>("/create_video_category/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: payload,
  });

export const updateVideoCategory = ({
  categoryId,
  patchData,
}: VideoCategoryUpdatePayload) =>
  api<VideoCategoryMutationResponse>(`/update_video_category/${categoryId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: patchData,
  });

export const deleteVideoCategory = (id: string) =>
  api<VideoCategoryMutationResponse>(`/delete_video_category/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
