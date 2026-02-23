export type PlanType = {
  id: number;
  name: string;
  is_active?: boolean;
};

export type PlanTypeListResponse = {
  statusCode: number;
  count?: number;
  data: PlanType[];
  message?: string | null;
};

export type PlanTypeCreatePayload = {
  name: string;
  is_active?: boolean;
};

export type PlanTypeUpdatePayload = {
  planTypeId: string;
  patchData: Partial<PlanTypeCreatePayload>;
};

export type PlanTypeMutationResponse = {
  message?: string;
  data?: PlanType | null;
} & Partial<PlanType>;
