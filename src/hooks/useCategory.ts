import { useAsyncAction } from "./useAsync";
import {
  CategoryCreatePayload,
  CategoryListResponse,
  CategoryMutationResponse,
  CategoryUpdatePayload,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/category.service";
import { ICategory } from "@/types/category";
import { usePaginated } from "./usePaginated";
import { useCallback } from "react";

export function useCategory() {
  const { run, loading } = useAsyncAction<CategoryMutationResponse>();

  const create = (payload: CategoryCreatePayload) =>
    run(() => createCategory(payload));

  return {
    data: create,
    loading,
  };
}

export function useGetCategories() {
  const { run, loading } = useAsyncAction<CategoryListResponse>();

  const get = () => run(() => getCategories());

  return {
    data: get,
    loading,
  };
}

export function useCategoriesPaginated(perPage = 10) {
  return usePaginated<ICategory>(getCategories, perPage);
}

export function useCategoriesPaginatedWithSearch(
  perPage = 10,
  searchTerm = ""
) {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getCategories(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<ICategory>(fetchPage, perPage);
}

export function useUpdateCategory() {
  const { run, loading } = useAsyncAction<CategoryMutationResponse>();

  const update = (payload: CategoryUpdatePayload) =>
    run(() => updateCategory(payload));

  return {
    data: update,
    loading,
  };
}

export function useDeleteCategory() {
  const { run, loading } = useAsyncAction<CategoryMutationResponse>();

  const destroy = (id: string) => run(() => deleteCategory(id));

  return {
    data: destroy,
    loading,
  };
}