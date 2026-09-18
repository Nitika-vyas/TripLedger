export type ExpenseCategory = "FUEL" | "TOLL" | "PARKING" | "FOOD" | "DRIVER_ALLOWANCE" | "REPAIRS" | "OTHER";
export type TripStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface TripExpense {
  id: string;
  category: ExpenseCategory;
  amount: string;
  notes: string | null;
  receiptUrl: string | null;
}

export interface TripIncome {
  id: string;
  ticketSales: string;
  otherIncome: string;
  notes: string | null;
}

export interface Trip {
  id: string;
  tripDate: string;
  busId: string;
  routeId: string;
  driverId: string | null;
  conductorId: string | null;
  distanceKm: string | null;
  passengerCount: number | null;
  parcelCount: number | null;
  status: TripStatus;
  notes: string | null;
  bus: { id: string; busNumber: string };
  route: { id: string; source: string; destination: string };
  driver: { id: string; name: string } | null;
  conductor: { id: string; name: string } | null;
  income: TripIncome | null;
  expenses: TripExpense[];
  totalIncome: number;
  totalExpense: number;
  profit: number;
}
