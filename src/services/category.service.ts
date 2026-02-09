import { api } from "@/lib/api";
import { ICategory } from "@/types/category";

export type CategoryListResponse = {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: ICategory[];
};

export type CategoryCreatePayload = {
  name: string;
  description: string;
};

export type CategoryUpdatePayload = {
  categoryId: string;
  patchData: Partial<CategoryCreatePayload>;
};

export type CategoryMutationResponse = {
  message?: string;
  data?: ICategory | null;
} & Partial<ICategory>;

export const getCategories = (
  page = 1,
  perPage = 10,
  searchTerm?: string
) => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";

  return api<CategoryListResponse>(
    `/list_category/?per_page=${perPage}&page=${page}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const searchCategories = (searchTerm: string, page = 1, perPage = 10) =>
  getCategories(page, perPage, searchTerm);

export const createCategory = (payload: CategoryCreatePayload) =>
  api<CategoryMutationResponse>("/create_category/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const updateCategory = ({ categoryId, patchData }: CategoryUpdatePayload) =>
  api<CategoryMutationResponse>(`/update_category/${categoryId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(patchData),
  });

export const deleteCategory = (id: string) =>
  api<CategoryMutationResponse>(`/delete_category/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
