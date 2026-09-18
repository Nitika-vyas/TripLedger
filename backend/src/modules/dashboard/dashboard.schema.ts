import { z } from "zod";

export const dashboardQuerySchema = z.object({
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
