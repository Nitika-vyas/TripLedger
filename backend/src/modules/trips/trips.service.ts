import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { withTenant } from "../../lib/prisma-scoped";
import { NotFoundError } from "../../lib/errors";
import { assertBelongsToTenant } from "../../lib/tenant-refs";
import type { CreateTripInput, ListTripsQuery, UpdateTripInput } from "./trips.schema";

const tripRefsInclude = {
  bus: { select: { id: true, busNumber: true } },
  route: { select: { id: true, source: true, destination: true } },
  driver: { select: { id: true, name: true } },
  conductor: { select: { id: true, name: true } },
} satisfies Prisma.TripInclude;

const tripDetailInclude = {
  ...tripRefsInclude,
  income: true,
  expenses: { orderBy: { createdAt: "asc" } },
  createdBy: { select: { id: true, fullName: true } },
} satisfies Prisma.TripInclude;

/**
 * The shape `listTrips` fetches (refs + income + expenses, no createdBy).
 * `withTenant`'s delegate wrapper is loosely typed (`any`), so without this
 * explicit annotation `listTrips`'s return type collapses to `any` and every
 * consumer (dashboard/reports aggregation) loses type-checking on it.
 */
type TripListItem = Prisma.TripGetPayload<{ include: typeof tripRefsInclude & { income: true; expenses: true } }>;

/** Adds computed totalIncome/totalExpense/profit (as numbers) to a trip that was fetched with income + expenses. */
function withFinancials<T extends { income: { ticketSales: Prisma.Decimal; otherIncome: Prisma.Decimal } | null; expenses: { amount: Prisma.Decimal }[] }>(
  trip: T
) {
  const totalIncome = trip.income ? Number(trip.income.ticketSales) + Number(trip.income.otherIncome) : 0;
  const totalExpense = trip.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  return { ...trip, totalIncome, totalExpense, profit: totalIncome - totalExpense };
}

async function validateTripRefs(tenantId: string, input: Partial<CreateTripInput>) {
  if (input.busId !== undefined) await assertBelongsToTenant(prisma.bus, tenantId, input.busId, "busId");
  if (input.routeId !== undefined) await assertBelongsToTenant(prisma.route, tenantId, input.routeId, "routeId");
  if (input.driverId !== undefined) await assertBelongsToTenant(prisma.driver, tenantId, input.driverId, "driverId");
  if (input.conductorId !== undefined)
    await assertBelongsToTenant(prisma.conductor, tenantId, input.conductorId, "conductorId");
}

/**
 * `take` defaults to 500 for the UI list view; pass `undefined` for
 * aggregation use cases (dashboard/report totals) where every matching
 * trip must be counted, not just the most recent page of them.
 */
export async function listTrips(tenantId: string, query: ListTripsQuery, take: number | undefined = 500) {
  const trips: TripListItem[] = await withTenant(prisma.trip, tenantId).findMany({
    where: {
      ...(query.busId ? { busId: query.busId } : {}),
      ...(query.routeId ? { routeId: query.routeId } : {}),
      ...(query.driverId ? { driverId: query.driverId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.dateFrom || query.dateTo
        ? {
            tripDate: {
              ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
              ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
            },
          }
        : {}),
    },
    include: { ...tripRefsInclude, income: true, expenses: true },
    orderBy: { tripDate: "desc" },
    ...(take !== undefined ? { take } : {}),
  });

  return trips.map(withFinancials);
}

export async function getTrip(tenantId: string, id: string) {
  const trip = await withTenant(prisma.trip, tenantId).findFirst({
    where: { id },
    include: tripDetailInclude,
  });
  if (!trip) throw new NotFoundError("Trip not found");
  return withFinancials(trip);
}

async function fetchTripWithFinancials(tx: Prisma.TransactionClient, tenantId: string, id: string) {
  const trip = await tx.trip.findFirst({
    where: { id, tenantId },
    include: tripDetailInclude,
  });
  if (!trip) throw new NotFoundError("Trip not found");
  return withFinancials(trip);
}

export async function createTrip(tenantId: string, userId: string, input: CreateTripInput) {
  await validateTripRefs(tenantId, input);

  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.create({
      data: {
        tenantId,
        tripDate: new Date(input.tripDate),
        busId: input.busId,
        routeId: input.routeId,
        driverId: input.driverId ?? null,
        conductorId: input.conductorId ?? null,
        distanceKm: input.distanceKm,
        passengerCount: input.passengerCount,
        parcelCount: input.parcelCount,
        status: input.status,
        notes: input.notes,
        createdById: userId,
      },
    });

    if (input.income) {
      await tx.tripIncome.create({
        data: {
          tenantId,
          tripId: trip.id,
          ticketSales: input.income.ticketSales,
          otherIncome: input.income.otherIncome,
          notes: input.income.notes,
        },
      });
    }

    if (input.expenses?.length) {
      await tx.tripExpense.createMany({
        data: input.expenses.map((e) => ({
          tenantId,
          tripId: trip.id,
          category: e.category,
          amount: e.amount,
          notes: e.notes,
          receiptUrl: e.receiptUrl,
        })),
      });
    }

    return fetchTripWithFinancials(tx, tenantId, trip.id);
  });
}

export async function updateTrip(tenantId: string, id: string, input: UpdateTripInput) {
  const existing = await withTenant(prisma.trip, tenantId).findFirst({ where: { id } });
  if (!existing) throw new NotFoundError("Trip not found");

  await validateTripRefs(tenantId, input);

  return prisma.$transaction(async (tx) => {
    await tx.trip.update({
      where: { id },
      data: {
        ...(input.tripDate !== undefined ? { tripDate: new Date(input.tripDate) } : {}),
        ...(input.busId !== undefined ? { busId: input.busId } : {}),
        ...(input.routeId !== undefined ? { routeId: input.routeId } : {}),
        ...(input.driverId !== undefined ? { driverId: input.driverId } : {}),
        ...(input.conductorId !== undefined ? { conductorId: input.conductorId } : {}),
        ...(input.distanceKm !== undefined ? { distanceKm: input.distanceKm } : {}),
        ...(input.passengerCount !== undefined ? { passengerCount: input.passengerCount } : {}),
        ...(input.parcelCount !== undefined ? { parcelCount: input.parcelCount } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
      },
    });

    if (input.income) {
      await tx.tripIncome.upsert({
        where: { tripId: id },
        create: {
          tenantId,
          tripId: id,
          ticketSales: input.income.ticketSales,
          otherIncome: input.income.otherIncome,
          notes: input.income.notes,
        },
        update: {
          ticketSales: input.income.ticketSales,
          otherIncome: input.income.otherIncome,
          notes: input.income.notes,
        },
      });
    }

    if (input.expenses) {
      // Simplest consistent strategy for a modal-edited expense list: replace wholesale.
      await tx.tripExpense.deleteMany({ where: { tripId: id } });
      if (input.expenses.length) {
        await tx.tripExpense.createMany({
          data: input.expenses.map((e) => ({
            tenantId,
            tripId: id,
            category: e.category,
            amount: e.amount,
            notes: e.notes,
            receiptUrl: e.receiptUrl,
          })),
        });
      }
    }

    return fetchTripWithFinancials(tx, tenantId, id);
  });
}

export async function deleteTrip(tenantId: string, id: string) {
  const existing = await withTenant(prisma.trip, tenantId).findFirst({ where: { id } });
  if (!existing) throw new NotFoundError("Trip not found");
  // TripExpense/TripIncome both cascade-delete with their parent Trip.
  await prisma.trip.delete({ where: { id } });
}
