import { prisma } from "../../config/prisma";
import { withTenant } from "../../lib/prisma-scoped";
import { NotFoundError, ConflictError } from "../../lib/errors";
import { rethrowFkConflict } from "../../lib/prisma-errors";
import type { ListQuery } from "../../lib/zod-helpers";
import type { CreateBusInput, UpdateBusInput } from "./buses.schema";

export async function listBuses(tenantId: string, query: ListQuery) {
  const scoped = withTenant(prisma.bus, tenantId);
  return scoped.findMany({
    where: {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? { OR: [{ busNumber: { contains: query.search } }, { type: { contains: query.search } }] }
        : {}),
    },
    orderBy: { busNumber: "asc" },
  });
}

export async function getBus(tenantId: string, id: string) {
  const bus = await withTenant(prisma.bus, tenantId).findFirst({ where: { id } });
  if (!bus) throw new NotFoundError("Bus not found");
  return bus;
}

export async function createBus(tenantId: string, input: CreateBusInput) {
  const existing = await prisma.bus.findUnique({
    where: { tenantId_busNumber: { tenantId, busNumber: input.busNumber } },
  });
  if (existing) throw new ConflictError("A bus with this number already exists");

  return withTenant(prisma.bus, tenantId).create({ data: input });
}

export async function updateBus(tenantId: string, id: string, input: UpdateBusInput) {
  await getBus(tenantId, id);

  if (input.busNumber) {
    const existing = await prisma.bus.findUnique({
      where: { tenantId_busNumber: { tenantId, busNumber: input.busNumber } },
    });
    if (existing && existing.id !== id) {
      throw new ConflictError("A bus with this number already exists");
    }
  }

  const result = await withTenant(prisma.bus, tenantId).updateMany({ where: { id }, data: input });
  if (result.count === 0) throw new NotFoundError("Bus not found");
  return getBus(tenantId, id);
}

export async function deleteBus(tenantId: string, id: string) {
  await getBus(tenantId, id);
  try {
    await withTenant(prisma.bus, tenantId).deleteMany({ where: { id } });
  } catch (err) {
    rethrowFkConflict(err, "Cannot delete this bus: it has trips on record. Deactivate it instead.");
  }
}
