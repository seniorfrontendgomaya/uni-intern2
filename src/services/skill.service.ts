import { api } from "@/lib/api";
import { ISkill } from "@/types/skill";

export type SkillListResponse = {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: ISkill[];
};

export type SkillCreatePayload = {
  name: string;
  description: string;
};

export type SkillUpdatePayload = {
  skillId: string;
  patchData: Partial<SkillCreatePayload>;
};

export type SkillMutationResponse = {
  message?: string;
  data?: ISkill | null;
} & Partial<ISkill>;

export const getSkills = (page = 1, perPage = 10, searchTerm?: string) => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";

  return api<SkillListResponse>(
    `/list_skill/?per_page=${perPage}&page=${page}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const searchSkills = (searchTerm: string, page = 1, perPage = 10) =>
  getSkills(page, perPage, searchTerm);

export const getAllSkills = (searchTerm?: string) =>
  getSkills(1, -1, searchTerm);

export const createSkill = (payload: SkillCreatePayload) =>
  api<SkillMutationResponse>("/create_skill/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const updateSkill = ({ skillId, patchData }: SkillUpdatePayload) =>
  api<SkillMutationResponse>(`/update_skill/${skillId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(patchData),
  });

export const deleteSkill = (id: string) =>
  api<SkillMutationResponse>(`/delete_skill/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
