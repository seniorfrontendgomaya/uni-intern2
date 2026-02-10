export type VideoCourseDetail = {
  id: number;
  name: string;
  description: string | null;
  duration: string | null;
  video: string | null;
  course_sub_category: number | { id: number; name: string } | null;
};

export type VideoCourseDetailListResponse = {
  statusCode?: number;
  data: VideoCourseDetail[];
  message?: string | null;
};

export type VideoCourseDetailMutationResponse = {
  message?: string;
  data?: VideoCourseDetail | null;
} & Partial<VideoCourseDetail>;

