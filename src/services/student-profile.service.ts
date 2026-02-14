import { api, apiBaseUrl } from "@/lib/api";
import { ValidationError } from "@/errors/http.errors";
import type { StudentProfileResponse } from "@/types/student-profile";

export const getStudentProfile = () =>
  api<StudentProfileResponse>("get_student_profile/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

/** Language option from get_language/ */
export interface LanguageOption {
  id: number;
  name: string;
}

/** GET get_language/ - list of languages for dropdown */
export async function getLanguageList(): Promise<LanguageOption[]> {
  const res = await api<{ data?: LanguageOption[] }>("get_language/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = res?.data;
  return Array.isArray(data) ? data : [];
}

/** Partial update payload for student profile (PATCH get_student_profile/) */
export interface StudentProfilePatch {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  country_code?: string;
  mobile?: string;
  gender?: string;
  qualification?: string;
  education?: string;
  /** City ID(s) from list_city - backend expects a list (e.g. [2]) */
  location?: number[];
  language?: number[];
  image?: File;
}

/**
 * Update student profile using PATCH on the same endpoint as GET.
 * If image is provided, sends FormData; otherwise sends JSON.
 */
export async function patchStudentProfile(
  payload: StudentProfilePatch
): Promise<StudentProfileResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const url = `${apiBaseUrl}get_student_profile/`;
  const isFormData = payload.image instanceof File;
  let body: FormData | string;
  let headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (isFormData) {
    const form = new FormData();
    if (payload.image) form.append("image", payload.image);
    if (payload.first_name !== undefined) form.append("first_name", payload.first_name);
    if (payload.last_name !== undefined) form.append("last_name", payload.last_name);
    if (payload.username !== undefined) form.append("username", payload.username);
    if (payload.email !== undefined) form.append("email", payload.email);
    if (payload.country_code !== undefined) form.append("country_code", payload.country_code);
    if (payload.mobile !== undefined) form.append("mobile", payload.mobile);
    if (payload.gender !== undefined) form.append("gender", payload.gender);
    if (payload.qualification !== undefined) form.append("qualification", payload.qualification ?? "");
    if (payload.education !== undefined) form.append("education", payload.education ?? "");
    if (payload.location !== undefined) {
      const ids = Array.isArray(payload.location) ? payload.location : [payload.location];
      ids.forEach((id) => form.append("location", String(id)));
    }
    if (payload.language !== undefined) {
      const ids = Array.isArray(payload.language) ? payload.language : [];
      ids.forEach((id) => form.append("language", String(id)));
    }
    body = form;
  } else {
    headers["Content-Type"] = "application/json";
    const json: Record<string, unknown> = {};
    if (payload.first_name !== undefined) json.first_name = payload.first_name;
    if (payload.last_name !== undefined) json.last_name = payload.last_name;
    if (payload.username !== undefined) json.username = payload.username;
    if (payload.email !== undefined) json.email = payload.email;
    if (payload.country_code !== undefined) json.country_code = payload.country_code;
    if (payload.mobile !== undefined) json.mobile = payload.mobile;
    if (payload.gender !== undefined) json.gender = payload.gender;
    if (payload.qualification !== undefined) json.qualification = payload.qualification;
    if (payload.education !== undefined) json.education = payload.education;
    if (payload.location !== undefined) {
      json.location = Array.isArray(payload.location) ? payload.location : [payload.location];
    }
    if (payload.language !== undefined) json.language = payload.language;
    body = JSON.stringify(json);
  }
  const res = await fetch(url, { method: "PATCH", headers, body });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ValidationError(err, res.status);
  }
  return res.json() as Promise<StudentProfileResponse>;
}

const STUDENT_ID_KEY = "user_id";
const STUDENT_NAME_KEY = "user_name";
const STUDENT_IMAGE_KEY = "user_image";

/**
 * After student login, call this to fetch student profile and save id, name (first + last), and image to localStorage.
 * Call only when token is already set and role is STUDENT.
 */
export async function fetchAndStoreStudentProfile(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const response = await getStudentProfile();
    const list = response?.data;
    if (!Array.isArray(list) || list.length === 0) return;
    const profile = list[0];
    const id = profile?.id;
    const first = profile?.first_name ?? "";
    const last = profile?.last_name ?? "";
    const name = [first, last].filter(Boolean).join(" ").trim() || undefined;
    const image = profile?.image ?? undefined;
    if (id != null) localStorage.setItem(STUDENT_ID_KEY, String(id));
    if (name) localStorage.setItem(STUDENT_NAME_KEY, name);
    if (image) localStorage.setItem(STUDENT_IMAGE_KEY, image);
  } catch {
    // Don't block login; profile can be loaded later
  }
}

export function clearStoredStudentProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STUDENT_ID_KEY);
  localStorage.removeItem(STUDENT_NAME_KEY);
  localStorage.removeItem(STUDENT_IMAGE_KEY);
}
