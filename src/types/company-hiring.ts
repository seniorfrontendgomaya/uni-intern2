export type CompanyHiringLocation = {
  id: number;
  name: string;
  description: string;
};

export type CompanyHiringCategory = {
  id: number;
  name: string;
  description: string;
};

export type CompanyHiringCompany = {
  id: number;
  name: string;
  image: string;
};

export type CompanyHiringJobType = {
  id: number;
  name: string;
  description?: string | null;
  is_job_offer?: boolean;
};

export type CompanyHiringDesignation = {
  id: number;
  name: string;
  description?: string | null;
};

export type CompanyHiringSkill = {
  id: number;
  name: string;
  description?: string | null;
};

export type CompanyHiringCourse = {
  id: number;
  name: string;
  description?: string | null;
  duration?: number;
  fees?: number;
  placement_gurantee?: boolean;
  is_recomended?: boolean;
  image?: string | null;
};

export type CompanyHiringPerk = {
  id: number;
  name: string;
  description?: string | null;
};

export type CompanyHiring = {
  id: number;
  comapany: CompanyHiringCompany; // Note: API has typo "comapany" instead of "company"
  description: string;
  location: CompanyHiringLocation[];
  category: CompanyHiringCategory[];
  job_type?: CompanyHiringJobType[];
  designation?: CompanyHiringDesignation[];
  skills?: CompanyHiringSkill[];
  course?: CompanyHiringCourse[];
  perk?: CompanyHiringPerk[];
  start_amount: number;
  end_amount: number;
  start_day: string;
  active: boolean;
  placement_gurantee_course: boolean;
  number_of_opening: number;
  is_fast_response: boolean;
  created_at: string;
  updated_at: string;
};

export type CompanyHiringListResponse = {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: CompanyHiring[];
};

export type CompanyHiringMutationResponse = {
  statusCode: number;
  message: string;
  data: CompanyHiring | null;
};

/** Detail response from detail_company_hiring_list/{id}/ */
export type CompanyHiringDetail = CompanyHiring & {
  about?: string | null;
  apply?: string | null;
  key_responsibility?: string | null;
  apply_start_date?: string | null;
  apply_end_date?: string | null;
  start_anual_salary?: number | null;
  end_anual_salary?: number | null;
};

export type CompanyHiringDetailResponse = {
  statusCode: number;
  message: string | null;
  data: CompanyHiringDetail | null;
};
