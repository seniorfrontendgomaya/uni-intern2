export type CompanyReference = {
  id: number;
  name: string;
  description: string | null;
};

export type CompanyData = {
  id: number;
  user_type: string;
  name: string;
  image: string | null;
  email: string;
  description: string | null;
  mobile: string;
  location: CompanyReference[];
  category: CompanyReference[];
  job_type: CompanyReference[];
  designation: CompanyReference[];
  skills: CompanyReference[];
  course: CompanyReference[];
  perk: CompanyReference[];
  start_amount: number;
  end_amount: number;
  start_day: string;
  start_anual_salary: number;
  end_anual_salary: number;
  active: boolean;
  placement_gurantee_course: boolean;
  number_of_opening: number;
  about: string;
  apply: string;
  key_responsibility: string;
  apply_start_date: string;
  apply_end_date: string;
  is_fast_response: boolean;
};

export type CompanyResponse = {
  statusCode: number;
  message: string | null;
  data: CompanyData;
};
