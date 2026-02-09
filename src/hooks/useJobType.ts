import { useAsyncAction } from "./useAsync";
import { useCallback } from "react";
import {
  createJobType,
  deleteJobType,
  getJobTypes,
  JobTypeCreatePayload,
  JobTypeListResponse,
  JobTypeMutationResponse,
  JobTypeUpdatePayload,
  updateJobType,
} from "@/services/jobtype.service";
import { IJobType } from "@/types/job.type";
import { usePaginated } from "./usePaginated";

export function useJobType() {
  const { run, loading } = useAsyncAction<JobTypeMutationResponse>();

  const create = (payload: JobTypeCreatePayload) =>
    run(() => createJobType(payload));

  return {
    data: create,
    loading,
  };
}

export function useGetJobTypes() {
  const { run, loading } = useAsyncAction<JobTypeListResponse>();

  const get = () => run(() => getJobTypes());

  return {
    data: get,
    loading,
  };
}

export function useJobTypesPaginated(perPage = 10, searchTerm = "") {
  const fetchPage = useCallback(
    (page: number, limit: number) =>
      getJobTypes(page, limit, searchTerm.trim() || undefined),
    [searchTerm]
  );

  return usePaginated<IJobType>(fetchPage, perPage);
}

export function useUpdateJobType() {
  const { run, loading } = useAsyncAction<JobTypeMutationResponse>();

  const update = (payload: JobTypeUpdatePayload) =>
    run(() => updateJobType(payload));

  return {
    data: update,
    loading,
  };
}

export function useDeleteJobType() {
  const { run, loading } = useAsyncAction<JobTypeMutationResponse>();

  const destroy = (id: string) => run(() => deleteJobType(id));

  return {
    data: destroy,
    loading,
  };
}