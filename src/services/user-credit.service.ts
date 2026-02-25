import { api } from "@/lib/api";

/** Current user credit from GET /user_credit/ (student role). */
export type CurrentUserCredit = {
  id: number;
  email: string;
  mobile: string;
  full_name: string;
  credit: number;
  is_active: boolean;
  used_credit: number;
};

export type CurrentUserCreditResponse = {
  statusCode?: number;
  message?: string;
  data?: CurrentUserCredit | null;
};

/**
 * GET /user_credit/
 * Fetch current (logged-in) student's credit. Returns null if not available or error.
 */
export async function getCurrentUserCredit(): Promise<CurrentUserCredit | null> {
  try {
    const raw = await api<CurrentUserCreditResponse>("/user_credit/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
      },
    });
    const data = raw?.data;
    return data && typeof data === "object" && typeof data.credit === "number" ? data : null;
  } catch {
    return null;
  }
}
