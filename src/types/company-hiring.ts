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

export type CompanyHiring = {
  id: number;
  comapany: CompanyHiringCompany; // Note: API has typo "comapany" instead of "company"
  description: string;
  location: CompanyHiringLocation[];
  category: CompanyHiringCategory[];
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
