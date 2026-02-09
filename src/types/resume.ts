export type ResumeListItem = {
  id: number;
  user: number;
  user_email: string;
  user_name: string;
  user_mobile: string;
  company: number;
  company_name: string;
  is_available: boolean;
  description: string | null;
  resume: string | null;
  resume_url: string | null;
};

export type ResumeListResponse = {
  statusCode: number;
  hasNextPage: boolean;
  next: string | null;
  previous: string | null;
  count: number;
  message: string | null;
  data: ResumeListItem[];
};
