export type UniversityProfile = {
  name: string | null;
  description: string | null;
  university_location: string | null;
  established_year: number | null;
  website: string | null;
  email: string | null;
  mobile: string | null;
  logo: string | null;
};

export type UniversityProfileResponse = {
  statusCode?: number;
  message?: string | null;
  error?: unknown;
  data: UniversityProfile;
};

export type UniversityProfilePatch = Partial<{
  name: string | null;
  description: string | null;
  university_location: string | null;
  established_year: number | null;
  website: string | null;
  email: string | null;
  mobile: string | null;
}>;

