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

