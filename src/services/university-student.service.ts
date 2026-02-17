import { api } from "@/lib/api";
import type {
  UniversityStudent,
  UniversityStudentListResponse,
} from "@/types/university-student";

type UniversityStudentListNormalized = Omit<UniversityStudentListResponse, "statusCode"> & {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  message: string | null;
};

export const getUniversityStudents = async (
  page = 1,
  perPage = 10,
  searchTerm?: string
): Promise<UniversityStudentListNormalized> => {
  const searchParam = searchTerm
    ? `&search=${encodeURIComponent(searchTerm)}`
    : "";
  const raw = await api<UniversityStudentListResponse>(
    `/bulk_student_create/?page=${page}&per_page=${perPage}${searchParam}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const hasNextPage = Boolean(raw.next);

  return {
    statusCode: raw.statusCode ?? 200,
    data: raw.data ?? [],
    count: raw.count ?? (raw.data ? raw.data.length : 0),
    next: raw.next ?? null,
    previous: raw.previous ?? null,
    hasNextPage,
    message: raw.message ?? null,
  };
};

export const bulkUploadUniversityStudents = (payload: FormData) =>
  api<unknown>("/bulk_student_create/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: payload,
  });

type DeleteUniversityStudentResponse = {
  statusCode: number;
  message: string;
  data: null;
};

export const deleteUniversityStudent = (id: number) =>
  api<DeleteUniversityStudentResponse>(`/university_student_api/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

type UpdateUniversityStudentPayload = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  mobile?: string | null;
};

type UpdateUniversityStudentResponse = {
  statusCode: number;
  message: string;
  data: {
    id: number;
    email: string;
    mobile: string | null;
  };
};

export const updateUniversityStudent = (
  id: number,
  payload: UpdateUniversityStudentPayload
) =>
  api<UpdateUniversityStudentResponse>(`/university_student_api/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });


