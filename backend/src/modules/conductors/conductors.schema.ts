import { z } from "zod";

export const createConductorSchema = z.object({
  name: z.string().trim().min(1).max(150),
  phone: z.string().trim().max(20).optional(),
  allowanceRate: z.coerce.number().nonnegative().optional(),
  assignedBusId: z.string().min(1).nullable().optional(),
});
export type CreateConductorInput = z.infer<typeof createConductorSchema>;

export const updateConductorSchema = createConductorSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateConductorInput = z.infer<typeof updateConductorSchema>;
