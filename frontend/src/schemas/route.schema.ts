import { z } from "zod";

const numericString = (fieldLabel: string) =>
  z
    .string()
    .min(1, `${fieldLabel} is required`)
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, `${fieldLabel} must be a positive number`);

const optionalNumericString = z
  .string()
  .optional()
  .refine((v) => !v || !Number.isNaN(Number(v)), "Must be a number");

export const routeSchema = z.object({
  source: z.string().min(1, "Source is required").max(150),
  destination: z.string().min(1, "Destination is required").max(150),
  distanceKm: numericString("Distance"),
  expectedFare: optionalNumericString,
  expectedDurationMin: optionalNumericString,
});
export type RouteFormValues = z.infer<typeof routeSchema>;

export const routeDefaultValues: RouteFormValues = {
  source: "",
  destination: "",
  distanceKm: "",
  expectedFare: "",
  expectedDurationMin: "",
};

export function toRoutePayload(values: RouteFormValues) {
  return {
    source: values.source,
    destination: values.destination,
    distanceKm: Number(values.distanceKm),
    expectedFare: values.expectedFare ? Number(values.expectedFare) : undefined,
    expectedDurationMin: values.expectedDurationMin ? Number(values.expectedDurationMin) : undefined,
  };
}
