import { api } from "@/lib/api";
import type {
  UniversityStudent,
  UniversityStudentListResponse,
} from "@/types/university-student";

type UniversityStudentListNormalized = UniversityStudentListResponse & {
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


