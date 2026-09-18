import { z } from "zod";

const dateOrNull = z
  .union([z.string().datetime(), z.string().date(), z.null()])
  .optional()
  .transform((v) => (v ? new Date(v) : v));

export const createDriverSchema = z.object({
  name: z.string().trim().min(1).max(150),
  phone: z.string().trim().max(20).optional(),
  licenseNumber: z.string().trim().max(50).optional(),
  licenseExpiry: dateOrNull,
  salaryRate: z.coerce.number().nonnegative().optional(),
  allowanceRate: z.coerce.number().nonnegative().optional(),
  assignedBusId: z.string().min(1).nullable().optional(),
});
export type CreateDriverInput = z.infer<typeof createDriverSchema>;

export const updateDriverSchema = createDriverSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
