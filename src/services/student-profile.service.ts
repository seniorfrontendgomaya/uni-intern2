import { api } from "@/lib/api";
import type { StudentProfileResponse } from "@/types/student-profile";

export const getStudentProfile = () =>
  api<StudentProfileResponse>("get_student_profile/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

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
