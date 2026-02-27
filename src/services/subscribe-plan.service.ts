import { api, apiBaseUrlNoSlash } from "@/lib/api";
import type {
  SubscribePlanCreatePayload,
  SubscribePlanMutationResponse,
  SubscribePlanResponse,
  SubscribePlanUpdatePayload,
} from "@/types/subscribe-plan";

/** Public (no auth) – e.g. for /internships/subscribe. */
export async function fetchSubscribePlans(): Promise<SubscribePlanResponse> {
  const res = await fetch(`${apiBaseUrlNoSlash}/get_subscribe_plan_api/`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string })?.message ?? "Failed to load plans");
  }
  return res.json() as Promise<SubscribePlanResponse>;
}

/** Superadmin list (auth required). Optional planTypeId to filter by plan type. */
export async function getSubscribePlans(planTypeId?: string): Promise<SubscribePlanResponse> {
  const query = planTypeId ? `?plan_type_id=${encodeURIComponent(planTypeId)}` : "";
  return api<SubscribePlanResponse>(`/subscribe_plan_api/${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    },
  });
}

export function createSubscribePlan(payload: SubscribePlanCreatePayload) {
  return api<SubscribePlanMutationResponse>("/subscribe_plan_api/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateSubscribePlan({ planId, patchData }: SubscribePlanUpdatePayload) {
  return api<SubscribePlanMutationResponse>(`/subscribe_plan_api/${planId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    },
    body: JSON.stringify(patchData),
  });
}

export function deleteSubscribePlan(id: string) {
  return api<SubscribePlanMutationResponse>(`/subscribe_plan_api/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    },
  });
}

/** Payload for subscription checkout (plan + referral + user details). */
export type SubscribeCheckoutPayload = {
  subscription_plan_id: number;
  referral_codes: string[];
  email: string;
  mobile: string;
  password: string;
};

/** Backend response after creating subscription; includes Cashfree session for redirect. */
export type SubscribeCheckoutResponseData = {
  subscription_id?: number;
  order_id?: string;
  cashfree_order_id?: string;
  payment_session_id?: string;
  amount?: number;
  base_amount?: number;
  discount?: number;
  referral_count?: number;
  referral_wallet_amount?: number;
  [key: string]: unknown;
};

export type SubscribeCheckoutResponse = {
  statusCode?: number;
  message?: string;
  data?: SubscribeCheckoutResponseData;
  /** Top-level fallbacks if backend sends session at root */
  session_id?: string;
  payment_session_id?: string;
};

export async function submitSubscribeCheckout(
  payload: SubscribeCheckoutPayload
): Promise<SubscribeCheckoutResponse> {
  return api<SubscribeCheckoutResponse>("/create_subscription/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export type PaymentConfirmationResponse = {
  statusCode: number;
  message: string;
  data: null;
};

export async function confirmSubscribePayment(
  orderId: string
): Promise<PaymentConfirmationResponse> {
  return api<PaymentConfirmationResponse>(`/payment_confirmation_api/?order_id=${orderId}`, {
    method: "GET",
  });
}
