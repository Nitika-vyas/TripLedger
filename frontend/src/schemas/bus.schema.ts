import { z } from "zod";

const numericString = (fieldLabel: string) =>
  z
    .string()
    .min(1, `${fieldLabel} is required`)
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, `${fieldLabel} must be a positive number`);

export const busSchema = z.object({
  busNumber: z.string().min(1, "Bus number is required").max(50),
  type: z.string().min(1, "Bus type is required").max(100),
  capacity: numericString("Capacity"),
  ownership: z.enum(["OWNED", "LEASED", "CONTRACTED"]),
  insuranceExpiry: z.string().optional(),
  fitnessExpiry: z.string().optional(),
  permitExpiry: z.string().optional(),
  pucExpiry: z.string().optional(),
});
export type BusFormValues = z.infer<typeof busSchema>;

export const busDefaultValues: BusFormValues = {
  busNumber: "",
  type: "",
  capacity: "",
  ownership: "OWNED",
  insuranceExpiry: "",
  fitnessExpiry: "",
  permitExpiry: "",
  pucExpiry: "",
};

/** Converts form strings into the JSON payload the backend API expects. */
export function toBusPayload(values: BusFormValues) {
  return {
    busNumber: values.busNumber,
    type: values.type,
    capacity: Number(values.capacity),
    ownership: values.ownership,
    insuranceExpiry: values.insuranceExpiry || null,
    fitnessExpiry: values.fitnessExpiry || null,
    permitExpiry: values.permitExpiry || null,
    pucExpiry: values.pucExpiry || null,
  };
}
