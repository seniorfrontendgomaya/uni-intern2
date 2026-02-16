// Resume Builder Types

export interface ResumeUserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  mobile: string;
  location: { id: number; name: string }[];
  image: string;
  language: { id: number; name: string }[];
  country_code: string;
  gender: string;
}

export interface ResumeUserProfileResponse {
  data: ResumeUserProfile[];
}

export interface CareerObjective {
  id: number;
  user: number;
  description: string;
}

export interface CareerObjectiveResponse {
  data: CareerObjective[];
}

export interface Education {
  id: number;
  user: number;
  education: "secondary" | "senior secondary" | "diploma" | "graduation/ post graduation" | "Phd";
  school_name: string;
  name: string;
  degree: string;
  stream: string;
  start_year: string;
  end_year: string | null;
  year_of_completion: string;
  is_ongoing: boolean;
  cgpa: number;
  cgpa2: string;
  board: string;
}

export interface EducationResponse {
  data: Education[];
}

export interface ExtraCurricularActivity {
  id: number;
  user: number;
  description: string;
}

export interface ExtraCurricularActivityResponse {
  data: ExtraCurricularActivity[];
}

export interface Training {
  id: number;
  user: number;
  training_program: string;
  organisation: string;
  location: string;
  is_online: boolean;
  is_ongoing: boolean;
  start_date: string;
  end_date: string;
  description: string;
}

export interface TrainingResponse {
  data: Training[];
}

export interface Project {
  id: number;
  user: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_ongoing: boolean;
  project_link: string;
}

export interface ProjectResponse {
  data: Project[];
}

export interface Skill {
  id: number;
  user?: number;
  skill?: string;
  name?: string;
  description?: string;
}

export interface SkillResponse {
  data: {
    skill: Skill[];
  };
}

export interface Accomplishment {
  id: number;
  user: number;
  description: string;
}

export interface AccomplishmentResponse {
  data: Accomplishment[];
}

export interface Language {
  id: number;
  name: string;
}

export interface LanguageResponse {
  data: Language[];
}
