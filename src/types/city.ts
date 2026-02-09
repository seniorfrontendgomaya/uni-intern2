export type City = {
  id: number;
  name: string;
  description: string | null;
};

export type CityListResponse = {
  statusCode: number;
  count: number;
  data: City[];
  message?: string | null;
};

export type CityMutationResponse = {
  message?: string;
  data?: City | null;
} & Partial<City>;
