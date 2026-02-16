/** API response from recommended_course_api */
export interface RecommendedCourseApiEntry {
  name?: string;
  course?: Array<{
    id?: number | string;
    name?: string;
    description?: string;
    image?: string | null;
    fees?: number | string | null;
    duration?: number | string | null;
    placement_gurantee?: boolean;
  }>;
  start_anual_salary?: number | string | null;
  end_anual_salary?: number | string | null;
}

export interface RecommendedCourseApiResponse {
  data?: RecommendedCourseApiEntry[];
}

/** UI model for landing course sections */
export interface RecommendedCourseItem {
  id: string;
  company: string;
  courses: string[];
  salaryStart: number | string | null;
  salaryEnd: number | string | null;
}
