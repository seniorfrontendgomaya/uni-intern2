import { api } from "@/lib/api";
import type {
  UniversityProfilePatch,
  UniversityProfileResponse,
} from "@/types/university-profile";

export const getUniversityProfile = () =>
  api<UniversityProfileResponse>("university/profile/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export type UpdateUniversityProfilePayload = {
  patchData: UniversityProfilePatch | FormData;
};

export const updateUniversityProfile = ({
  patchData,
}: UpdateUniversityProfilePayload) => {
  const isFormData =
    typeof FormData !== "undefined" && patchData instanceof FormData;

  return api<UniversityProfileResponse>("university/profile/", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: isFormData ? patchData : JSON.stringify(patchData),
  });
};

