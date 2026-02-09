"use client";

import { usePaginated } from "./usePaginated";
import {
  SkillCreatePayload,
  SkillMutationResponse,
  SkillUpdatePayload,
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from "@/services/skill.service";
import { ISkill } from "@/types/skill";
import { useAsyncAction } from "./useAsync";
import { useCallback } from "react";

export function useSkillsPaginated(perPage = 10, searchTerm = "") {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getSkills(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<ISkill>(fetchPage, perPage);
}

export function useSkill() {
  const { run, loading } = useAsyncAction<SkillMutationResponse>();

  const create = (payload: SkillCreatePayload) =>
    run(() => createSkill(payload));

  return { data: create, loading };
}

export function useUpdateSkill() {
  const { run, loading } = useAsyncAction<SkillMutationResponse>();

  const update = (payload: SkillUpdatePayload) =>
    run(() => updateSkill(payload));

  return { data: update, loading };
}

export function useDeleteSkill() {
  const { run, loading } = useAsyncAction<SkillMutationResponse>();

  const destroy = (id: string) => run(() => deleteSkill(id));

  return { data: destroy, loading };
}
