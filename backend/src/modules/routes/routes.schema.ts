import { z } from "zod";

export const createRouteSchema = z.object({
  source: z.string().trim().min(1).max(150),
  destination: z.string().trim().min(1).max(150),
  distanceKm: z.coerce.number().positive(),
  expectedFare: z.coerce.number().nonnegative().optional(),
  expectedDurationMin: z.coerce.number().int().positive().optional(),
});
export type CreateRouteInput = z.infer<typeof createRouteSchema>;

export const updateRouteSchema = createRouteSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;
