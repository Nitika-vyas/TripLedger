import { z } from "zod";

export const createTenantSchema = z.object({
  companyName: z.string().trim().min(2).max(150),
  contactEmail: z.string().email(),
  contactPhone: z.string().trim().max(20).optional(),
  adminFullName: z.string().trim().min(2).max(150),
  adminEmail: z.string().email(),
  /** Optional — if omitted, a random temporary password is generated and returned once. */
  password: z.string().min(8).max(100).optional(),
});
export type CreateTenantInput = z.infer<typeof createTenantSchema>;

export const updateTenantStatusSchema = z.object({ isActive: z.boolean() });
