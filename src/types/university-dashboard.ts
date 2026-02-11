/** Reference item from API (location, skill, designation, etc.) */
export type DashboardRef = {
  id: number;
  name: string;
  description?: string | null;
};

export type UniversityDashboardStatistics = {
  total_students: number;
  total_companies: number;
  total_universities: number;
  total_messages: number;
};

/** Recent student item from university dashboard API */
export type DashboardRecentStudent = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  image: string | null;
  language: unknown[];
  email: string;
  country_code: string | null;
  mobile: string | null;
  qualification: string | null;
  location: unknown[];
  skills: unknown[];
  gender: string | null;
  education: unknown;
};

/** Recent company item from university dashboard API */
export type DashboardRecentCompany = {
  id: number;
  user_type: string;
  name: string;
  image: string | null;
  email: string;
  description: string | null;
  mobile: string | null;
  location: DashboardRef[];
  category: DashboardRef[];
  job_type: (DashboardRef & { is_job_offer?: boolean })[];
  designation: DashboardRef[];
  skills: DashboardRef[];
  course: DashboardRef[];
  perk: DashboardRef[];
  number_of_opening: number | null;
  about: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type UniversityDashboardData = {
  statistics: UniversityDashboardStatistics;
  recent_students: DashboardRecentStudent[];
  recent_companies: DashboardRecentCompany[];
};

export type UniversityDashboardResponse = {
  statusCode: number;
  message: string | null;
  data: UniversityDashboardData;
};
