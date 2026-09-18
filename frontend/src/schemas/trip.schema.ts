import { z } from "zod";

export const EXPENSE_CATEGORIES = [
  "FUEL",
  "TOLL",
  "PARKING",
  "FOOD",
  "DRIVER_ALLOWANCE",
  "REPAIRS",
  "OTHER",
] as const;

const optionalNumericString = z
  .string()
  .optional()
  .refine((v) => !v || !Number.isNaN(Number(v)), "Must be a number");

const optionalIntegerString = z
  .string()
  .optional()
  .refine((v) => !v || (Number.isInteger(Number(v)) && Number(v) >= 0), "Must be a whole number, 0 or more");

const expenseRowSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  notes: z.string().optional(),
  /** Set once the receipt file has finished uploading (see ReceiptUpload). */
  receiptUrl: z.string().optional(),
});
export type ExpenseRowValues = z.infer<typeof expenseRowSchema>;

export const tripSchema = z.object({
  tripDate: z.string().min(1, "Date is required"),
  busId: z.string().min(1, "Bus is required"),
  routeId: z.string().min(1, "Route is required"),
  driverId: z.string().optional(),
  conductorId: z.string().optional(),
  distanceKm: optionalNumericString,
  passengerCount: optionalIntegerString,
  parcelCount: optionalIntegerString,
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
  ticketSales: optionalNumericString,
  otherIncome: optionalNumericString,
  incomeNotes: z.string().optional(),
  expenses: z.array(expenseRowSchema),
});
export type TripFormValues = z.infer<typeof tripSchema>;

export const tripDefaultValues: TripFormValues = {
  tripDate: new Date().toISOString().slice(0, 10),
  busId: "",
  routeId: "",
  driverId: "",
  conductorId: "",
  distanceKm: "",
  passengerCount: "",
  parcelCount: "",
  status: "SCHEDULED",
  notes: "",
  ticketSales: "",
  otherIncome: "",
  incomeNotes: "",
  expenses: [],
};

export function toTripPayload(values: TripFormValues) {
  return {
    tripDate: values.tripDate,
    busId: values.busId,
    routeId: values.routeId,
    driverId: values.driverId || null,
    conductorId: values.conductorId || null,
    distanceKm: values.distanceKm ? Number(values.distanceKm) : undefined,
    passengerCount: values.passengerCount ? Number(values.passengerCount) : undefined,
    parcelCount: values.parcelCount ? Number(values.parcelCount) : undefined,
    status: values.status,
    notes: values.notes || undefined,
    income: {
      ticketSales: values.ticketSales ? Number(values.ticketSales) : 0,
      otherIncome: values.otherIncome ? Number(values.otherIncome) : 0,
      notes: values.incomeNotes || undefined,
    },
    expenses: values.expenses.map((e) => ({
      category: e.category,
      amount: Number(e.amount),
      notes: e.notes || undefined,
      receiptUrl: e.receiptUrl || undefined,
    })),
  };
}
