import { BadRequestError } from "./errors";

interface FindFirstDelegate {
  findFirst: (args: { where: { id: string; tenantId: string } }) => Promise<unknown>;
}

/**
 * Confirms a foreign-key id (busId, routeId, driverId, ...) supplied in a
 * request body actually belongs to the caller's tenant, so a user from one
 * tenant can't reference another tenant's records by guessing their ids.
 * No-ops for null/undefined (optional relations).
 */
export async function assertBelongsToTenant(
  delegate: FindFirstDelegate,
  tenantId: string,
  id: string | null | undefined,
  fieldLabel: string
) {
  if (!id) return;
  const record = await delegate.findFirst({ where: { id, tenantId } });
  if (!record) {
    throw new BadRequestError(`${fieldLabel} does not refer to a record in this company`);
  }
}
