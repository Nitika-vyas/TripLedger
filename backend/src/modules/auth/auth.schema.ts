import { z } from "zod";

export const signupSchema = z.object({
  companyName: z.string().min(2).max(150),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(20).optional(),
  adminFullName: z.string().min(2).max(150),
  adminEmail: z.string().email(),
  password: z.string().min(8).max(100),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;
