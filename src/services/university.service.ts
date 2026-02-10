import { api } from "@/lib/api";
import type {
  UniversityListResponse,
  UniversityMutationResponse,
} from "@/types/university";

export type UniversityCreatePayload = FormData;

export type UniversityUpdatePayload = {
  universityId: string;
  patchData: FormData | Partial<{
    name: string;
    description: string;
    university_location: string;
    established_year: string | number;
    website: string;
    email: string;
    mobile: string;
    password?: string;
  }>;
};

type UniversityListNormalized = UniversityListResponse & {
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  message: string | null;
};

export const getUniversities = async (
  page = 1,
  perPage = 10
): Promise<UniversityListNormalized> => {
  const raw = await api<UniversityListResponse>(
    `/get_university/?per_page=${perPage}&page=${page}`,
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

export const createUniversity = (payload: UniversityCreatePayload) =>
  api<UniversityMutationResponse>("/create_university/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: payload,
  });

export const updateUniversity = ({
  universityId,
  patchData,
}: UniversityUpdatePayload) => {
  const isFormData =
    typeof FormData !== "undefined" && patchData instanceof FormData;

  return api<UniversityMutationResponse>(`/update_university/${universityId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: isFormData ? patchData : JSON.stringify(patchData),
  });
};

export const deleteUniversity = (id: string) =>
  api<UniversityMutationResponse>(`/delete_university/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

