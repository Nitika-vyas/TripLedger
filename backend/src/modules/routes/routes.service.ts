import { prisma } from "../../config/prisma";
import { withTenant } from "../../lib/prisma-scoped";
import { NotFoundError } from "../../lib/errors";
import { rethrowFkConflict } from "../../lib/prisma-errors";
import type { ListQuery } from "../../lib/zod-helpers";
import type { CreateRouteInput, UpdateRouteInput } from "./routes.schema";

export async function listRoutes(tenantId: string, query: ListQuery) {
  const scoped = withTenant(prisma.route, tenantId);
  return scoped.findMany({
    where: {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? { OR: [{ source: { contains: query.search } }, { destination: { contains: query.search } }] }
        : {}),
    },
    orderBy: [{ source: "asc" }, { destination: "asc" }],
  });
}

export async function getRoute(tenantId: string, id: string) {
  const route = await withTenant(prisma.route, tenantId).findFirst({ where: { id } });
  if (!route) throw new NotFoundError("Route not found");
  return route;
}

export async function createRoute(tenantId: string, input: CreateRouteInput) {
  return withTenant(prisma.route, tenantId).create({ data: input });
}

export async function updateRoute(tenantId: string, id: string, input: UpdateRouteInput) {
  await getRoute(tenantId, id);
  const result = await withTenant(prisma.route, tenantId).updateMany({ where: { id }, data: input });
  if (result.count === 0) throw new NotFoundError("Route not found");
  return getRoute(tenantId, id);
}

export async function deleteRoute(tenantId: string, id: string) {
  await getRoute(tenantId, id);
  try {
    await withTenant(prisma.route, tenantId).deleteMany({ where: { id } });
  } catch (err) {
    rethrowFkConflict(err, "Cannot delete this route: it has trips on record. Deactivate it instead.");
  }
}
