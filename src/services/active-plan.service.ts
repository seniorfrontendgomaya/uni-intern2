import { api } from "@/lib/api";
import type { ActivePlanResponse } from "@/types/active-plan";

/**
 * Fetch active plan types for dropdown.
 * Optional search param to filter by query.
 * By default (no search or empty string) returns full list.
 */
export async function getActivePlans(search?: string): Promise<ActivePlanResponse> {
  const query = typeof search === "string" && search.trim() !== ""
    ? `?search=${encodeURIComponent(search.trim())}`
    : "";
  return api<ActivePlanResponse>(`/active_plan_api/${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    },
  });
}
