import { prisma } from "../../config/prisma";
import { buildSuperAdminWhere, tenantSelect } from "../../lib/super-admin-query";
import type { SuperAdminListQuery } from "../../lib/zod-helpers";

const busRefSelect = { assignedBus: { select: { id: true, busNumber: true } } };

export function listAllBuses(query: SuperAdminListQuery) {
  return prisma.bus.findMany({
    where: buildSuperAdminWhere(query, { searchFields: ["busNumber", "type"] }),
    include: tenantSelect,
    orderBy: [{ tenant: { name: "asc" } }, { busNumber: "asc" }],
  });
}

export function listAllDrivers(query: SuperAdminListQuery) {
  return prisma.driver.findMany({
    where: buildSuperAdminWhere(query, { searchFields: ["name"] }),
    include: { ...tenantSelect, ...busRefSelect },
    orderBy: [{ tenant: { name: "asc" } }, { name: "asc" }],
  });
}

export function listAllConductors(query: SuperAdminListQuery) {
  return prisma.conductor.findMany({
    where: buildSuperAdminWhere(query, { searchFields: ["name"] }),
    include: { ...tenantSelect, ...busRefSelect },
    orderBy: [{ tenant: { name: "asc" } }, { name: "asc" }],
  });
}

export function listAllRoutes(query: SuperAdminListQuery) {
  return prisma.route.findMany({
    where: buildSuperAdminWhere(query, { searchFields: ["source", "destination"] }),
    include: tenantSelect,
    orderBy: [{ tenant: { name: "asc" } }, { source: "asc" }],
  });
}

export function listAllTrips(query: SuperAdminListQuery) {
  return prisma.trip.findMany({
    // Trip has no isActive column and isn't free-text searched (yet).
    where: buildSuperAdminWhere(query, { supportsIsActive: false }),
    include: {
      ...tenantSelect,
      bus: { select: { id: true, busNumber: true } },
      route: { select: { id: true, source: true, destination: true } },
      driver: { select: { id: true, name: true } },
      conductor: { select: { id: true, name: true } },
    },
    orderBy: [{ tripDate: "desc" }],
    take: 200,
  });
}
