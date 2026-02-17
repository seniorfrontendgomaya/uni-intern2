import { api, apiBaseUrl } from "@/lib/api";
import type {
  ResumeUserProfileResponse,
  CareerObjectiveResponse,
  EducationResponse,
  ExtraCurricularActivityResponse,
  TrainingResponse,
  ProjectResponse,
  SkillResponse,
  AccomplishmentResponse,
  LanguageResponse,
} from "@/types/resume-builder";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// User Profile
export const getResumeUserProfile = () =>
  api<ResumeUserProfileResponse>("get_student_profile/", {
    headers: getAuthHeaders(),
  });

export type ResumeUserProfilePatchPayload = Partial<{
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile: string;
  gender: string;
  language: number[];
  location: number[];
}>;

export const updateResumeUserProfile = (payload: ResumeUserProfilePatchPayload) =>
  api<{ message: string; data: any }>("get_student_profile/", {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

// Career Objective
export const getCareerObjectives = () =>
  api<CareerObjectiveResponse>("get_user_objective/", {
    headers: getAuthHeaders(),
  });

export const createCareerObjective = (data: { description: string }) =>
  api<{ message: string; data: any }>("create_suer_objective/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateCareerObjective = (id: number, data: { description: string }) =>
  api<{ message: string; data: any }>(`update_user_objective/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteCareerObjective = (id: number) =>
  api<{ message: string }>(`delete_user_objective/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

// Education
export const getUserEducation = () =>
  api<EducationResponse>("get_user_education/", {
    headers: getAuthHeaders(),
  });

export type EducationCreatePayload =
  | {
      education: "secondary";
      school_name: string;
      board: string;
      cgpa: string;
      cgpa2: string;
      year_of_completion: string;
    }
  | {
      education: "senior secondary";
      school_name: string;
      board: string;
      cgpa: string;
      cgpa2: string;
      year_of_completion: string;
      stream: string;
    }
  | {
      education: "graduation/ post graduation";
      name: string;
      degree: string;
      school_name: string;
      start_year: string;
      end_year: string | null;
      stream: string;
      cgpa: string;
      cgpa2: string;
      is_ongoing: boolean;
    }
  | {
      education: "diploma";
      name: string;
      degree: string;
      school_name: string;
      start_year: string;
      end_year: string | null;
      stream: string;
      cgpa: string;
      cgpa2: string;
      is_ongoing: boolean;
    }
  | {
      education: "Phd";
      name: string;
      school_name: string;
      start_year: string;
      end_year: string | null;
      stream: string;
      cgpa: string;
      cgpa2: string;
      is_ongoing: boolean;
    };

export const createUserEducation = (data: EducationCreatePayload) =>
  api<{ message: string; data: any }>("create_user_education/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export type EducationUpdatePayload = Partial<{
  education: string;
  school_name: string;
  board: string;
  cgpa: string;
  cgpa2: string;
  year_of_completion: string;
  name: string;
  degree: string;
  start_year: string;
  end_year: string | null;
  stream: string;
  is_ongoing: boolean;
}>;

export const updateUserEducation = (id: number, data: EducationUpdatePayload) =>
  api<{ message: string; data: any }>(`update_user_education/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteUserEducation = (id: number) =>
  api<{ message: string }>(`delete_user_education/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

// Extra Curricular Activities
export const getExtraCurricularActivities = () =>
  api<ExtraCurricularActivityResponse>("get_user_extra_curriculam_acitivity/", {
    headers: getAuthHeaders(),
  });

export const createExtraCurricularActivity = (data: { description: string }) =>
  api<{ message: string; data: any }>("create_user_extra_curriculam_acitivity/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateExtraCurricularActivity = (id: number, data: { description: string }) =>
  api<{ message: string; data: any }>(`update_user_extra_curriculam_acitivity/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteExtraCurricularActivity = (id: number) =>
  api<{ message: string }>(`delete_user_extra_curriculam_acitivity/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

// Training/Courses
export const getUserTraining = () =>
  api<TrainingResponse>("get_user_training/", {
    headers: getAuthHeaders(),
  });

export const createUserTraining = (data: {
  training_program: string;
  organisation: string;
  location: string;
  is_online: boolean;
  is_ongoing: boolean;
  start_date: string;
  end_date: string;
  description: string;
}) =>
  api<{ message: string; data: any }>("create_user_training_detail/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateUserTraining = (
  id: number,
  data: {
    training_program?: string;
    organisation?: string;
    location?: string;
    is_online?: boolean;
    is_ongoing?: boolean;
    start_date?: string;
    end_date?: string;
    description?: string;
  }
) =>
  api<{ message: string; data: any }>(`upate_user_training/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteUserTraining = (id: number) =>
  api<{ message: string }>(`delete_user_training/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

// Projects
export const getUserProjects = () =>
  api<ProjectResponse>("get_user_project/", {
    headers: getAuthHeaders(),
  });

export const createUserProject = (data: {
  title: string;
  start_date: string;
  end_date: string;
  is_ongoing: boolean;
  description: string;
  project_link: string;
}) =>
  api<{ message: string; data: any }>("create_user_project/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateUserProject = (
  id: number,
  data: {
    title?: string;
    start_date?: string;
    end_date?: string;
    is_ongoing?: boolean;
    description?: string;
    project_link?: string;
  }
) =>
  api<{ message: string; data: any }>(`update_user_project/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteUserProject = (id: number) =>
  api<{ message: string }>(`delete_user_project/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

// Skills
export const getUserSkills = () =>
  api<SkillResponse>("get_user_skill/", {
    headers: getAuthHeaders(),
  });

export const createUserSkill = (data: { skill: string; description: string }) =>
  api<{ message: string; data: any }>("create_user_skill/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateUserSkill = (id: number, data: { skill?: string; description?: string }) =>
  api<{ message: string; data: any }>(`update_user_skill/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteUserSkill = (id: number) =>
  api<{ message: string }>(`delete_user_skill/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

// Accomplishments
export const getUserAccomplishments = () =>
  api<AccomplishmentResponse>("get_user_additional_detail/", {
    headers: getAuthHeaders(),
  });

export const createUserAccomplishment = (data: { description: string }) =>
  api<{ message: string; data: any }>("create_user_additional_detail/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateUserAccomplishment = (id: number, data: { description: string }) =>
  api<{ message: string; data: any }>(`update_user_additional_detail/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteUserAccomplishment = (id: number) =>
  api<{ message: string }>(`delete_user_additional_detail/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

// Languages
export const getLanguages = (search?: string) => {
  const searchParam = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
  return api<LanguageResponse>(`get_language/${searchParam}`, {
    headers: getAuthHeaders(),
  });
};

// Resume Download
export const downloadResume = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiBaseUrl}download/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to download resume");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
