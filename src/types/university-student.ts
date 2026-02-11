export type UniversityStudent = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  is_active: boolean;
};

export type UniversityStudentListResponse = {
  statusCode?: number;
  data: UniversityStudent[];
  count: number;
  next: string | null;
  previous: string | null;
  message?: string | null;
};

/** Shape for recent-student display (UI). All fields optional; pluggable with API response. */
export type RecentStudent = {
  id?: number;
  first_name?: string | null;
  last_name?: string | null;
  image?: string | null;
  email?: string | null;
  mobile?: string | null;
  qualification?: string | null;
  location?: unknown[];
  skills?: unknown[];
  gender?: string | null;
};

