export type ActivePlanItem = {
  id: number;
  name: string;
  [key: string]: unknown;
};

export type ActivePlanResponse = {
  statusCode?: number;
  message?: string;
  data?: ActivePlanItem[];
};
