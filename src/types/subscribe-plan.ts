export interface SubscribePlanItem {
  id: number;
  name: string;
  plan_name: string;
  description: string;
  price: number;
  is_active: boolean;
}

export interface SubscribePlanResponse {
  statusCode: number;
  message: string;
  data: SubscribePlanItem[];
}

export type SubscribePlanCreatePayload = {
  name: string;
  /** Plan type id from dropdown (sent as "plan" in API). */
  plan: number;
  description: string;
  price: number;
  is_active: boolean;
};

export type SubscribePlanUpdatePayload = {
  planId: string;
  patchData: Partial<SubscribePlanCreatePayload>;
};

export type SubscribePlanMutationResponse = {
  message?: string;
  data?: SubscribePlanItem | null;
} & Partial<SubscribePlanItem>;
