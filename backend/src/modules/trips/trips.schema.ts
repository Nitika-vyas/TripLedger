import { z } from "zod";

export const expenseCategoryEnum = z.enum([
  "FUEL",
  "TOLL",
  "PARKING",
  "FOOD",
  "DRIVER_ALLOWANCE",
  "REPAIRS",
  "OTHER",
]);

export const tripStatusEnum = z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]);

const tripExpenseInputSchema = z.object({
  category: expenseCategoryEnum,
  amount: z.coerce.number().positive(),
  notes: z.string().trim().max(500).optional(),
  /** Set by uploading via POST /api/uploads/receipt first, then passing back the returned URL. */
  receiptUrl: z.string().trim().max(500).optional(),
});
export type TripExpenseInput = z.infer<typeof tripExpenseInputSchema>;

const tripIncomeInputSchema = z.object({
  ticketSales: z.coerce.number().nonnegative().default(0),
  otherIncome: z.coerce.number().nonnegative().default(0),
  notes: z.string().trim().max(500).optional(),
});
export type TripIncomeInput = z.infer<typeof tripIncomeInputSchema>;

export const createTripSchema = z.object({
  tripDate: z.string().date(),
  busId: z.string().min(1),
  routeId: z.string().min(1),
  driverId: z.string().min(1).nullable().optional(),
  conductorId: z.string().min(1).nullable().optional(),
  distanceKm: z.coerce.number().positive().optional(),
  passengerCount: z.coerce.number().int().nonnegative().optional(),
  parcelCount: z.coerce.number().int().nonnegative().optional(),
  status: tripStatusEnum.default("COMPLETED"),
  notes: z.string().trim().max(1000).optional(),
  income: tripIncomeInputSchema.optional(),
  expenses: z.array(tripExpenseInputSchema).max(50).optional(),
});
export type CreateTripInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = createTripSchema.partial();
export type UpdateTripInput = z.infer<typeof updateTripSchema>;

export const listTripsQuerySchema = z.object({
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  busId: z.string().min(1).optional(),
  routeId: z.string().min(1).optional(),
  driverId: z.string().min(1).optional(),
  status: tripStatusEnum.optional(),
});
export type ListTripsQuery = z.infer<typeof listTripsQuerySchema>;
