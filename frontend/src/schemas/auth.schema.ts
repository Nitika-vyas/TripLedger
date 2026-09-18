import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z.string().optional(),
  adminFullName: z.string().min(2, "Your name is required"),
  adminEmail: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type SignupFormValues = z.infer<typeof signupSchema>;
