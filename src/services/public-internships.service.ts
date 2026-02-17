import { getApiUrl } from "@/lib/api";

/** API typo: backend returns "comapany" instead of "company" */
export interface PublicInternshipCompany {
  id: number;
  name: string;
  image: string;
}

export interface PublicInternshipItem {
  id: number;
  user_type?: string;
  name?: string;
  image?: string | null;
  /** When present (e.g. from intership/), use for company name and image. */
  comapany?: PublicInternshipCompany;
  email?: string;
  description: string | null;
  mobile: string | null;
  location: Array<{ id: number; name: string; description: string }>;
  category: Array<{ id: number; name: string; description?: string }>;
  job_type: Array<{ id: number; name: string; description?: string }>;
  designation: Array<{ id: number; name: string; description?: string }>;
  skills: Array<{ id: number; name: string; description?: string }>;
  course: Array<unknown>;
  perk: Array<unknown>;
  start_amount: number | null;
  end_amount: number | null;
  start_day: string | null;
  start_anual_salary: number | null;
  end_anual_salary: number | null;
  active: boolean;
  placement_gurantee_course: boolean;
  number_of_opening: number;
  about: string | null;
  apply: string | null;
  key_responsibility: string | null;
  apply_start_date: string | null;
  apply_end_date: string | null;
  is_fast_response: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicInternshipsResponse {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: PublicInternshipItem[];
}

export type PublicInternshipsQuery = {
  location?: string;
  skill?: string;
  profile?: string;
  placement_course?: string;
  page?: number;
  page_size?: number;
  [key: string]: string | number | undefined;
};

const DEFAULT_PAGE_SIZE = 10;

/** Fetch public internship list. Pass query params from URL (e.g. location, skill, page). */
export async function fetchPublicInternships(
  query: PublicInternshipsQuery
): Promise<PublicInternshipsResponse> {
  const params: Record<string, string> = {};
  if (query.location?.trim()) params.location = String(query.location).trim();
  if (query.skill?.trim()) params.skill = String(query.skill).trim();
  if (query.profile?.trim()) params.profile = String(query.profile).trim();
  if (query.placement_course?.trim()) params.placement_course = String(query.placement_course).trim();
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.max(1, Math.min(100, Number(query.page_size) || DEFAULT_PAGE_SIZE));
  params.page = String(page);
  params.page_size = String(pageSize);

  const url = getApiUrl("intership/", params);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return {
      statusCode: res.status,
      hasNextPage: false,
      next: null,
      previous: null,
      count: 0,
      message: null,
      data: [],
    };
  }
  return (await res.json()) as PublicInternshipsResponse;
}
