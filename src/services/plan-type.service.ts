import { api } from "@/lib/api";
import type {
  PlanType,
  PlanTypeListResponse,
  PlanTypeMutationResponse,
  PlanTypeCreatePayload,
  PlanTypeUpdatePayload,
} from "@/types/plan-type";

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
  };
}

export async function getPlanTypes(): Promise<PlanTypeListResponse> {
  const raw = await api<PlanTypeListResponse | PlanType[]>("/plan_api/", {
    method: "GET",
    headers: authHeaders(),
  });
  const data = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as PlanTypeListResponse)?.data)
      ? (raw as PlanTypeListResponse).data
      : [];
  const count = Array.isArray(raw) ? data.length : (raw as PlanTypeListResponse)?.count ?? data.length;
  return {
    statusCode: Array.isArray(raw) ? 200 : (raw as PlanTypeListResponse)?.statusCode ?? 200,
    count,
    data,
    message: Array.isArray(raw) ? null : (raw as PlanTypeListResponse)?.message ?? null,
  };
}

export function createPlanType(payload: PlanTypeCreatePayload) {
  return api<PlanTypeMutationResponse>("/plan_api/", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updatePlanType({ planTypeId, patchData }: PlanTypeUpdatePayload) {
  return api<PlanTypeMutationResponse>(
    `/plan_api/${planTypeId}/`,
    {
      method: "PATCH",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(patchData),
    }
  );
}

export function deletePlanType(id: string) {
  return api<PlanTypeMutationResponse>(`/plan_api/${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
