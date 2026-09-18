import { prisma } from "../../config/prisma";
import { withTenant } from "../../lib/prisma-scoped";
import { NotFoundError } from "../../lib/errors";
import { rethrowFkConflict } from "../../lib/prisma-errors";
import { assertBelongsToTenant } from "../../lib/tenant-refs";
import type { ListQuery } from "../../lib/zod-helpers";
import type { CreateConductorInput, UpdateConductorInput } from "./conductors.schema";

export async function listConductors(tenantId: string, query: ListQuery) {
  const scoped = withTenant(prisma.conductor, tenantId);
  return scoped.findMany({
    where: {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search ? { name: { contains: query.search } } : {}),
    },
    include: { assignedBus: { select: { id: true, busNumber: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getConductor(tenantId: string, id: string) {
  const conductor = await withTenant(prisma.conductor, tenantId).findFirst({
    where: { id },
    include: { assignedBus: { select: { id: true, busNumber: true } } },
  });
  if (!conductor) throw new NotFoundError("Conductor not found");
  return conductor;
}

export async function createConductor(tenantId: string, input: CreateConductorInput) {
  await assertBelongsToTenant(prisma.bus, tenantId, input.assignedBusId, "assignedBusId");
  return withTenant(prisma.conductor, tenantId).create({ data: input });
}

export async function updateConductor(tenantId: string, id: string, input: UpdateConductorInput) {
  await getConductor(tenantId, id);
  await assertBelongsToTenant(prisma.bus, tenantId, input.assignedBusId, "assignedBusId");

  const result = await withTenant(prisma.conductor, tenantId).updateMany({ where: { id }, data: input });
  if (result.count === 0) throw new NotFoundError("Conductor not found");
  return getConductor(tenantId, id);
}

export async function deleteConductor(tenantId: string, id: string) {
  await getConductor(tenantId, id);
  try {
    await withTenant(prisma.conductor, tenantId).deleteMany({ where: { id } });
  } catch (err) {
    rethrowFkConflict(
      err,
      "Cannot delete this conductor: they have trips on record. Deactivate them instead."
    );
  }
}
