export interface CourseCard {
  id: string;
  name: string;
  title: string;
  provider: string;
  image: string | null;
  tag?: {
    label: string;
    variant: "bestseller" | "hot-new";
  };
  price: number;
  description?: string;
  duration?: number;
}
