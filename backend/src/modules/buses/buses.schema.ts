import { z } from "zod";

const ownershipEnum = z.enum(["OWNED", "LEASED", "CONTRACTED"]);

const dateOrNull = z
  .union([z.string().datetime(), z.string().date(), z.null()])
  .optional()
  .transform((v) => (v ? new Date(v) : v));

export const createBusSchema = z.object({
  busNumber: z.string().trim().min(1).max(50),
  type: z.string().trim().min(1).max(100),
  capacity: z.coerce.number().int().positive(),
  ownership: ownershipEnum.default("OWNED"),
  insuranceExpiry: dateOrNull,
  fitnessExpiry: dateOrNull,
  permitExpiry: dateOrNull,
  pucExpiry: dateOrNull,
});
export type CreateBusInput = z.infer<typeof createBusSchema>;

export const updateBusSchema = createBusSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateBusInput = z.infer<typeof updateBusSchema>;
