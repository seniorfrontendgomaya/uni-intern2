import { api } from "@/lib/api";

export type CourseSubscriptionWalletData = {
  subscription_id: number;
  is_paid: boolean;
  amount_to_pay: number;
  course_fee: number;
  wallet_deduction: number;
  wallet_balance_before: number;
  wallet_balance_after: number;
  payment_recipient?: {
    id: number;
    email: string;
    name: string;
    type: string;
  };
};

export type CourseSubscriptionGatewayData = {
  subscription_id: number;
  order_id: string;
  cashfree_order_id: string;
  payment_session_id: string;
  amount_to_pay: number;
  course_fee: number;
  wallet_deduction: number;
  payment_recipient?: {
    id: number;
    email: string;
    name: string;
    type: string;
  };
  wallet_info?: {
    wallet_balance_before: number;
    wallet_balance_after: number;
    wallet_deduction: number;
  };
};

export type CourseSubscriptionCreateResponse = {
  statusCode?: number;
  message?: string;
  data?: CourseSubscriptionWalletData | CourseSubscriptionGatewayData;
};

/** Create a course subscription for the given course id and course request id. */
export async function createCourseSubscription(
  courseId: number,
  courseRequestId: number
): Promise<CourseSubscriptionCreateResponse> {
  return api<CourseSubscriptionCreateResponse>("/create_course_subscription/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${
        typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""
      }`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      course_id: courseId,
      course_request_id: courseRequestId,
    }),
  });
}

