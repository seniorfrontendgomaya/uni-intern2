export interface Skill {
  id: number;
  name: string;
  description: string;
}

export interface Language {
  id: number;
  name: string;
  description: string;
}

export interface StudentProfile {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  image: string;
  language: Language[];
  email: string;
  country_code: string;
  mobile: string;
  qualification: string | null;
  location: { id: number; name: string }[];
  skills: Skill[];
  gender: string;
  education: string;
}

export interface StudentProfileResponse {
  statusCode: number;
  message: string | null;
  data: StudentProfile[];
}
