import { z } from "zod";

export const TENANT_ROLES = ["COMPANY_ADMIN", "MANAGER", "DATA_ENTRY"] as const;

export const createUserSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(150),
  email: z.string().email("Enter a valid email"),
  role: z.enum(TENANT_ROLES),
  phone: z.string().optional(),
  password: z.string().min(8, "At least 8 characters").optional().or(z.literal("")),
});
export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const createUserDefaultValues: CreateUserFormValues = {
  fullName: "",
  email: "",
  role: "DATA_ENTRY",
  phone: "",
  password: "",
};

export function toCreateUserPayload(values: CreateUserFormValues) {
  return {
    fullName: values.fullName,
    email: values.email,
    role: values.role,
    phone: values.phone || undefined,
    password: values.password || undefined,
  };
}

export const editUserSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(150),
  role: z.enum(TENANT_ROLES),
  phone: z.string().optional(),
  isActive: z.boolean(),
  newPassword: z.string().min(8, "At least 8 characters").optional().or(z.literal("")),
});
export type EditUserFormValues = z.infer<typeof editUserSchema>;

export function toEditUserPayload(values: EditUserFormValues) {
  return {
    fullName: values.fullName,
    role: values.role,
    phone: values.phone || undefined,
    isActive: values.isActive,
    password: values.newPassword || undefined,
  };
}
