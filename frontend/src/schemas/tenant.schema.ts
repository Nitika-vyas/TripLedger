import { z } from "zod";

export const createTenantSchema = z.object({
  companyName: z.string().min(2, "Company name is required").max(150),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z.string().optional(),
  adminFullName: z.string().min(2, "Admin name is required").max(150),
  adminEmail: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters").optional().or(z.literal("")),
});
export type CreateTenantFormValues = z.infer<typeof createTenantSchema>;

export const createTenantDefaultValues: CreateTenantFormValues = {
  companyName: "",
  contactEmail: "",
  contactPhone: "",
  adminFullName: "",
  adminEmail: "",
  password: "",
};

export function toCreateTenantPayload(values: CreateTenantFormValues) {
  return {
    companyName: values.companyName,
    contactEmail: values.contactEmail,
    contactPhone: values.contactPhone || undefined,
    adminFullName: values.adminFullName,
    adminEmail: values.adminEmail,
    password: values.password || undefined,
  };
}
