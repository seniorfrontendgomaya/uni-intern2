import { api } from "@/lib/api";
import type { UniversityDashboardResponse } from "@/types/university-dashboard";

export async function getUniversityDashboard(): Promise<UniversityDashboardResponse> {
  return api<UniversityDashboardResponse>("university/dashboard/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    },
  });
}
