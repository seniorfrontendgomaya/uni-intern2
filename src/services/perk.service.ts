import { api } from "@/lib/api";
import { IPerk } from "@/types/perk";

export type PerkListResponse = {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: IPerk[];
};

export type PerkCreatePayload = {
  name: string;
  description: string;
};

export type PerkUpdatePayload = {
  perkId: string;
  patchData: Partial<PerkCreatePayload>;
};

export type PerkMutationResponse = {
  message?: string;
  data?: IPerk | null;
} & Partial<IPerk>;

export const getPerks = (page = 1, perPage = 10, searchTerm?: string) => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";

  return api<PerkListResponse>(
    `/list_perk/?per_page=${perPage}&page=${page}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const searchPerks = (searchTerm: string, page = 1, perPage = 10) =>
  getPerks(page, perPage, searchTerm);

export const getAllPerks = (searchTerm?: string) =>
  getPerks(1, -1, searchTerm);

export const createPerk = (payload: PerkCreatePayload) =>
  api<PerkMutationResponse>("/create_perk/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const updatePerk = ({ perkId, patchData }: PerkUpdatePayload) =>
  api<PerkMutationResponse>(`/update_perk/${perkId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(patchData),
  });

export const deletePerk = (id: string) =>
  api<PerkMutationResponse>(`/delete_perk/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
