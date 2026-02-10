import { api } from "@/lib/api";
import type {
  VideoSubcategory,
  VideoSubcategoryListResponse,
  VideoSubcategoryMutationResponse,
} from "@/types/video-subcategory";

export type VideoSubcategoryCreatePayload = {
  name: string;
  description?: string;
  course_category: string | number;
};

export type VideoSubcategoryUpdatePayload = {
  subcategoryId: string;
  patchData: Partial<{
    name: string;
    description: string;
    course_category: string | number;
  }>;
};

type VideoSubcategoryListNormalized = VideoSubcategoryListResponse & {
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  message: string | null;
};

function normalizeListPayload(raw: any): VideoSubcategory[] {
  if (Array.isArray(raw)) {
    return raw as VideoSubcategory[];
  }
  if (raw && Array.isArray(raw.data)) {
    return raw.data as VideoSubcategory[];
  }
  return [];
}

export const getVideoSubcategories = async (
  page = 1,
  perPage = 10,
  categoryId?: string
): Promise<VideoSubcategoryListNormalized> => {
  const query = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : "";
  const raw = await api<any>(`/course_sub_category_list/${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const all = normalizeListPayload(raw);
  const totalCount =
    typeof raw?.count === "number" && raw.count > 0 ? raw.count : all.length;

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const data = all.slice(start, end);
  const hasNextPage = totalCount > page * perPage;

  const base: VideoSubcategoryListResponse = {
    statusCode: 200,
    count: totalCount,
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

export const createVideoSubcategory = (payload: VideoSubcategoryCreatePayload) =>
  api<VideoSubcategoryMutationResponse>("/course_sub_category_list/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const updateVideoSubcategory = ({
  subcategoryId,
  patchData,
}: VideoSubcategoryUpdatePayload) =>
  api<VideoSubcategoryMutationResponse>(
    `/update_course_sub_category/${subcategoryId}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(patchData),
    }
  );

export const deleteVideoSubcategory = (subcategoryId: string) =>
  api<VideoSubcategoryMutationResponse>(
    `/update_course_sub_category/${subcategoryId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

