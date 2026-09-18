import { z } from "zod";

export const tenantRoleEnum = z.enum(["COMPANY_ADMIN", "MANAGER", "DATA_ENTRY"]);

export const createUserSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  email: z.string().email(),
  role: tenantRoleEnum,
  phone: z.string().trim().max(20).optional(),
  /** Optional — if omitted, a random temporary password is generated and returned once. */
  password: z.string().min(8).max(100).optional(),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2).max(150).optional(),
  role: tenantRoleEnum.optional(),
  phone: z.string().trim().max(20).optional(),
  isActive: z.boolean().optional(),
  /** Setting this resets the user's password (an admin-initiated reset). */
  password: z.string().min(8).max(100).optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
