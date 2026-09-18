import { prisma } from "../../config/prisma";
import { withTenant } from "../../lib/prisma-scoped";
import { NotFoundError } from "../../lib/errors";
import { rethrowFkConflict } from "../../lib/prisma-errors";
import { assertBelongsToTenant } from "../../lib/tenant-refs";
import type { ListQuery } from "../../lib/zod-helpers";
import type { CreateDriverInput, UpdateDriverInput } from "./drivers.schema";

export async function listDrivers(tenantId: string, query: ListQuery) {
  const scoped = withTenant(prisma.driver, tenantId);
  return scoped.findMany({
    where: {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search ? { name: { contains: query.search } } : {}),
    },
    include: { assignedBus: { select: { id: true, busNumber: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getDriver(tenantId: string, id: string) {
  const driver = await withTenant(prisma.driver, tenantId).findFirst({
    where: { id },
    include: { assignedBus: { select: { id: true, busNumber: true } } },
  });
  if (!driver) throw new NotFoundError("Driver not found");
  return driver;
}

export async function createDriver(tenantId: string, input: CreateDriverInput) {
  await assertBelongsToTenant(prisma.bus, tenantId, input.assignedBusId, "assignedBusId");
  return withTenant(prisma.driver, tenantId).create({ data: input });
}

export async function updateDriver(tenantId: string, id: string, input: UpdateDriverInput) {
  await getDriver(tenantId, id);
  await assertBelongsToTenant(prisma.bus, tenantId, input.assignedBusId, "assignedBusId");

  const result = await withTenant(prisma.driver, tenantId).updateMany({ where: { id }, data: input });
  if (result.count === 0) throw new NotFoundError("Driver not found");
  return getDriver(tenantId, id);
}

export async function deleteDriver(tenantId: string, id: string) {
  await getDriver(tenantId, id);
  try {
    await withTenant(prisma.driver, tenantId).deleteMany({ where: { id } });
  } catch (err) {
    rethrowFkConflict(err, "Cannot delete this driver: they have trips on record. Deactivate them instead.");
  }
}
