import { z } from "zod";

const optionalNumericString = z
  .string()
  .optional()
  .refine((v) => !v || !Number.isNaN(Number(v)), "Must be a number");

export const conductorSchema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  phone: z.string().max(20).optional(),
  allowanceRate: optionalNumericString,
  assignedBusId: z.string().optional(),
});
export type ConductorFormValues = z.infer<typeof conductorSchema>;

export const conductorDefaultValues: ConductorFormValues = {
  name: "",
  phone: "",
  allowanceRate: "",
  assignedBusId: "",
};

export function toConductorPayload(values: ConductorFormValues) {
  return {
    name: values.name,
    phone: values.phone || undefined,
    allowanceRate: values.allowanceRate ? Number(values.allowanceRate) : undefined,
    assignedBusId: values.assignedBusId || null,
  };
}
