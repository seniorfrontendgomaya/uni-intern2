export interface ICourse {
  id: string;
  name: string;
  description: string;
  duration?: string | null;
  fees?: string | null;
  placement_gurantee?: string | boolean | null;
  is_recomended?: boolean | null;
  image?: string | null;
}
