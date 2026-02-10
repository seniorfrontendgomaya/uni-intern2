export type VideoSubcategory = {
  id: number;
  name: string;
  description: string | null;
  course_category: number | { id: number; name: string } | null;
};

export type VideoSubcategoryListResponse = {
  statusCode: number;
  count: number;
  data: VideoSubcategory[];
  message?: string | null;
};

export type VideoSubcategoryMutationResponse = {
  message?: string;
  data?: VideoSubcategory | null;
} & Partial<VideoSubcategory>;

