/** Matches GET /referal_api_view/ response item. */
export type ReferralItem = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  student_id?: number;
  refferal_code?: string;
  referral_code?: string;
  student_code_count?: number;
  is_active?: boolean;
};

export type ReferralListResponse = {
  statusCode?: number;
  hasNextPage?: boolean;
  next?: string | null;
  previous?: string | null;
  count?: number;
  message?: string | null;
  data?: ReferralItem[];
};
