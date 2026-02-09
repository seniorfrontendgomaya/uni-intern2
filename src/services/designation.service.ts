import { api } from "@/lib/api";
import { IDesignation } from "@/types/designation";

export type DesignationListResponse = {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: IDesignation[];
};

export type DesignationCreatePayload = {
  name: string;
  description: string;
};

export type DesignationUpdatePayload = {
  designationId: string;
  patchData: Partial<DesignationCreatePayload>;
};

export type DesignationMutationResponse = {
  message?: string;
  data?: IDesignation | null;
} & Partial<IDesignation>;

export const getDesignations = (
  page = 1,
  perPage = 10,
  searchTerm?: string
) => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";

  return api<DesignationListResponse>(
    `/list_designation/?per_page=${perPage}&page=${page}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const searchDesignations = (searchTerm: string, page = 1, perPage = 10) =>
  getDesignations(page, perPage, searchTerm);

export const createDesignation = (payload: DesignationCreatePayload) =>
  api<DesignationMutationResponse>("/create_designation/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const updateDesignation = ({
  designationId,
  patchData,
}: DesignationUpdatePayload) =>
  api<DesignationMutationResponse>(
    `/update_designation/${designationId}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(patchData),
    }
  );

export const deleteDesignation = (id: string) =>
  api<DesignationMutationResponse>(`/delete_designation/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
