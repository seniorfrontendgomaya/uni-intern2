export type University = {
  id: number;
  user_type?: string;
  name: string;
  description: string | null;
  university_location: string | null;
  established_year: number | string | null;
  website: string | null;
  email: string | null;
  mobile: string | null;
  logo: string | null;
};

export type UniversityListResponse = {
  statusCode: number;
  count: number;
  data: University[];
  message?: string | null;
};

export type UniversityMutationResponse = {
  message?: string;
  data?: University | null;
} & Partial<University>;

