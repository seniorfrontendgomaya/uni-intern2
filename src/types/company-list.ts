import type { CompanyReference } from "@/types/company";

export type CompanyListItem = {
  id: number;
  name: string;
  description: string | null;
  location: CompanyReference[] | null;
  active: boolean;
  placement_gurantee_course: boolean;
};

export type CompanyListResponse = {
  statusCode: number;
  count: number;
  data: CompanyListItem[];
  message?: string | null;
};

export type CompanyMutationResponse = {
  message?: string;
  data?: CompanyListItem | null;
} & Partial<CompanyListItem>;
