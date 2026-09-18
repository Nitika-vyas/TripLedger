import type { SuperAdminListQuery } from "./zod-helpers";

export const tenantSelect = { tenant: { select: { id: true as const, name: true as const, slug: true as const } } };

interface SuperAdminWhereConfig {
  /** Fields matched with a case-sensitive `contains` when `search` is passed. */
  searchFields?: string[];
  /** Set false for resources without an `isActive` column (e.g. Trip). */
  supportsIsActive?: boolean;
}

/**
 * Builds the shared `where` shape for a super-admin cross-tenant list
 * endpoint: optional `tenantId` filter, optional `isActive` filter, and an
 * OR-across-fields free-text search — so each resource's service function
 * only has to declare which fields it supports instead of repeating the
 * filter-building logic.
 */
export function buildSuperAdminWhere(query: SuperAdminListQuery, config: SuperAdminWhereConfig = {}) {
  const { searchFields, supportsIsActive = true } = config;
  const where: Record<string, unknown> = {};

  if (query.tenantId) where.tenantId = query.tenantId;
  if (supportsIsActive && query.isActive !== undefined) where.isActive = query.isActive;
  if (searchFields?.length && query.search) {
    where.OR = searchFields.map((field) => ({ [field]: { contains: query.search } }));
  }

  return where;
}
