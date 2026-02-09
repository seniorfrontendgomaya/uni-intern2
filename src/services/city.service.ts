import { api } from "@/lib/api";
import type { CityListResponse, CityMutationResponse } from "@/types/city";

export type CityCreatePayload = {
  name: string;
  description: string;
};

export type CityUpdatePayload = {
  cityId: string;
  patchData: Partial<CityCreatePayload>;
};

type CityListNormalized = CityListResponse & {
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  message: string | null;
};

export const getCities = async (
  page = 1,
  perPage = 10,
  searchTerm?: string
): Promise<CityListNormalized> => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";
  const raw = await api<CityListResponse>(
    `/list_city/?per_page=${perPage}&page=${page}${searchParam}`,
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

export const searchCities = (searchTerm: string, page = 1, perPage = 10) =>
  getCities(page, perPage, searchTerm);

export const createCity = (payload: CityCreatePayload) =>
  api<CityMutationResponse>("/create_city/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const updateCity = ({ cityId, patchData }: CityUpdatePayload) =>
  api<CityMutationResponse>(`/update_city/${cityId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(patchData),
  });

export const deleteCity = (id: string) =>
  api<CityMutationResponse>(`/delete_city/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
