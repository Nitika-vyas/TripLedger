import { z } from "zod";
import { tripStatusEnum } from "../trips/trips.schema";

export const exportTripsQuerySchema = z.object({
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  busId: z.string().min(1).optional(),
  routeId: z.string().min(1).optional(),
  driverId: z.string().min(1).optional(),
  status: tripStatusEnum.optional(),
  format: z.enum(["csv", "xlsx", "pdf"]).default("xlsx"),
});
export type ExportTripsQuery = z.infer<typeof exportTripsQuerySchema>;
