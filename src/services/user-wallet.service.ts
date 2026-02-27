import { api } from "@/lib/api";

export type UserWalletResponse = {
  statusCode?: number;
  message?: string | null;
  data?: {
    id: number;
    balance: string;
    credits: number;
    remaining_amount: number;
    total_earned: string;
  };
};

/**
 * GET /get_user_wallet/
 * Fetch current user's wallet (balance, credits).
 * Minimum wallet use: ₹500 (amounts below that cannot be used).
 */
export async function getUserWallet(): Promise<UserWalletResponse["data"] | null> {
  try {
    const res = await api<UserWalletResponse>("/get_user_wallet/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
      },
    });
    return res?.data ?? null;
  } catch {
    return null;
  }
}
