import { listTrips } from "../trips/trips.service";
import type { ListTripsQuery } from "../trips/trips.schema";
import type { DashboardQuery } from "./dashboard.schema";

type TripWithFinancials = Awaited<ReturnType<typeof listTrips>>[number];

/** Formats a real "now" instant as the server's *local* calendar date (YYYY-MM-DD). */
function toLocalISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function defaultDateRange() {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return { dateFrom: toLocalISODate(firstOfMonth), dateTo: toLocalISODate(now) };
}

/**
 * Recovers the calendar date a trip was stored with. `trip.tripDate` was
 * built from a plain "YYYY-MM-DD" string (`new Date(dateString)`), which the
 * JS spec parses as UTC midnight — so, unlike a real "now" instant, it must
 * be read back with the UTC getters (`toISOString`) to get the same date the
 * user actually entered, regardless of the server's local timezone.
 */
function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function buildTrend(trips: TripWithFinancials[]) {
  const byDate = new Map<string, { income: number; expense: number }>();
  for (const trip of trips) {
    const key = toISODate(trip.tripDate);
    const entry = byDate.get(key) ?? { income: 0, expense: 0 };
    entry.income += trip.totalIncome;
    entry.expense += trip.totalExpense;
    byDate.set(key, entry);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, income: v.income, expense: v.expense, profit: v.income - v.expense }));
}

function topBy<K extends string>(
  trips: TripWithFinancials[],
  keyOf: (t: TripWithFinancials) => string,
  labelOf: (t: TripWithFinancials) => Record<K, string>
) {
  const grouped = new Map<string, { trips: number; income: number; expense: number; profit: number } & Record<K, string>>();
  for (const trip of trips) {
    const key = keyOf(trip);
    const existing = grouped.get(key);
    if (existing) {
      existing.trips += 1;
      existing.income += trip.totalIncome;
      existing.expense += trip.totalExpense;
      existing.profit += trip.profit;
    } else {
      grouped.set(key, { ...labelOf(trip), trips: 1, income: trip.totalIncome, expense: trip.totalExpense, profit: trip.profit });
    }
  }
  return [...grouped.values()].sort((a, b) => b.profit - a.profit).slice(0, 5);
}

export async function getDashboardSummary(tenantId: string, query: DashboardQuery) {
  const range = query.dateFrom || query.dateTo ? query : defaultDateRange();
  const trips = await listTrips(tenantId, range as ListTripsQuery, undefined);

  const totalIncome = trips.reduce((sum, t) => sum + t.totalIncome, 0);
  const totalExpense = trips.reduce((sum, t) => sum + t.totalExpense, 0);

  return {
    range,
    totals: {
      totalTrips: trips.length,
      completedTrips: trips.filter((t) => t.status === "COMPLETED").length,
      scheduledTrips: trips.filter((t) => t.status === "SCHEDULED").length,
      cancelledTrips: trips.filter((t) => t.status === "CANCELLED").length,
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
    },
    trend: buildTrend(trips),
    topRoutes: topBy(trips, (t) => t.routeId, (t) => ({ source: t.route.source, destination: t.route.destination })),
    topBuses: topBy(trips, (t) => t.busId, (t) => ({ busNumber: t.bus.busNumber })),
  };
}
