export interface CourseCard {
  id: string;
  title: string;
  provider: string;
  image: string;
  tag?: {
    label: string;
    variant: "bestseller" | "hot-new";
  };
  rating: {
    stars: number;
    count: number;
  };
  price: number;
}
