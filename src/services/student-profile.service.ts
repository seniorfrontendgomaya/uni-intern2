import { api } from "@/lib/api";
import type { StudentProfileResponse } from "@/types/student-profile";

export const getStudentProfile = () =>
  api<StudentProfileResponse>("get_student_profile/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
