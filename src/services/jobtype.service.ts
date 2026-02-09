import { IJobType } from "@/types/job.type";
import { api } from "@/lib/api";

export type JobTypeListResponse = {
    statusCode: number;
    hasNextPage: boolean;
    next: string | null;
    previous: string | null;
    count: number;
    message: string | null;
    data: IJobType[];
  };

export type JobTypeCreatePayload = {
  name: string;
  description: string;
};

export type JobTypeUpdatePayload = {
  jobTypeId: string;
  patchData: Partial<JobTypeCreatePayload>;
};

export type JobTypeMutationResponse = {
  message?: string;
  data?: IJobType | null;
} & Partial<IJobType>;

export const getJobTypes = (
  page = 1,
  perPage = 10,
  searchTerm?: string
) => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";

  return api<JobTypeListResponse>(
    `/list_job_type/?per_page=${perPage}&page=${page}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const searchJobTypes = (searchTerm: string, page = 1, perPage = 10) =>
  getJobTypes(page, perPage, searchTerm);


export const createJobType = (payload: JobTypeCreatePayload) =>
  api<JobTypeMutationResponse>("/create_job_type/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

export const updateJobType = ({ jobTypeId, patchData }: JobTypeUpdatePayload) =>
  api<JobTypeMutationResponse>(`/update_job_type/${jobTypeId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(patchData),
  });

export const deleteJobType = (id: string) =>
  api<JobTypeMutationResponse>(`/delete_job_type/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
