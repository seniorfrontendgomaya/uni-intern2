export type VideoCategory = {
  id: number;
  name: string;
  title: string;
  description: string | null;
  fee: number | null;
  placement_gurantee_course: boolean;
  banner_image: string | null;
  what_you_learn?: string | null;
  requirement?: string | null;
  detail?: string | null;
  reason?: string | null;
  for_who?: string | null;
};

export type VideoCategoryListResponse = {
  statusCode: number;
  count: number;
  data: VideoCategory[];
  message?: string | null;
};

export type VideoCategoryMutationResponse = {
  message?: string;
  data?: VideoCategory | null;
} & Partial<VideoCategory>;
