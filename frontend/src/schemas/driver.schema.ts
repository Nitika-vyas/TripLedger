import { z } from "zod";

const optionalNumericString = z
  .string()
  .optional()
  .refine((v) => !v || !Number.isNaN(Number(v)), "Must be a number");

export const driverSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  phone: z.string().max(20).optional(),
  licenseNumber: z.string().max(50).optional(),
  licenseExpiry: z.string().optional(),
  salaryRate: optionalNumericString,
  allowanceRate: optionalNumericString,
  assignedBusId: z.string().optional(),
});
export type DriverFormValues = z.infer<typeof driverSchema>;

export const driverDefaultValues: DriverFormValues = {
  name: "",
  phone: "",
  licenseNumber: "",
  licenseExpiry: "",
  salaryRate: "",
  allowanceRate: "",
  assignedBusId: "",
};

export function toDriverPayload(values: DriverFormValues) {
  return {
    name: values.name,
    phone: values.phone || undefined,
    licenseNumber: values.licenseNumber || undefined,
    licenseExpiry: values.licenseExpiry || null,
    salaryRate: values.salaryRate ? Number(values.salaryRate) : undefined,
    allowanceRate: values.allowanceRate ? Number(values.allowanceRate) : undefined,
    assignedBusId: values.assignedBusId || null,
  };
}
