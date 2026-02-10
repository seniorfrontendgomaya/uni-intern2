export type VideoCourse = {
  id: number;
  name: string;
  title: string;
  description: string | null;
  fee: number | string | null;
  is_placement_gurantee: boolean;
  what_you_learn?: string | null;
  requirement?: string | null;
  detail?: string | null;
  reason?: string | null;
  for_who?: string | null;
  image: string | null;
};

export type VideoCourseListResponse = {
  statusCode: number;
  count: number;
  data: VideoCourse[];
  message?: string | null;
};

export type VideoCourseMutationResponse = {
  message?: string;
  data?: VideoCourse | null;
} & Partial<VideoCourse>;

