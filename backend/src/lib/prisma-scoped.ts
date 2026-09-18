/**
 * Thin helper to make tenant scoping structural rather than something that's
 * easy to forget in a service. Each tenant-owned Prisma model delegate
 * (prisma.bus, prisma.driver, ...) exposes the same find/create/update/delete
 * shape, so we wrap it to always merge `tenantId` into `where`/`data`.
 *
 * This is a defense-in-depth helper, not the only line of defense: every
 * service method is still expected to pass `tenantId` explicitly.
 */
export function withTenant<T extends Record<string, any>>(
  delegate: T,
  tenantId: string
) {
  return {
    findMany: (args: any = {}) =>
      delegate.findMany({
        ...args,
        where: { ...(args.where ?? {}), tenantId },
      }),
    findFirst: (args: any = {}) =>
      delegate.findFirst({
        ...args,
        where: { ...(args.where ?? {}), tenantId },
      }),
    count: (args: any = {}) =>
      delegate.count({
        ...args,
        where: { ...(args.where ?? {}), tenantId },
      }),
    create: (args: any) =>
      delegate.create({
        ...args,
        data: { ...args.data, tenantId },
      }),
    /**
     * updateMany/deleteMany scope by tenantId automatically. For single-record
     * update/delete by id, prefer findFirst({ where: { id, tenantId } }) first
     * to confirm ownership (returns 404, not a leaked 403) before mutating.
     */
    updateMany: (args: any) =>
      delegate.updateMany({
        ...args,
        where: { ...(args.where ?? {}), tenantId },
      }),
    deleteMany: (args: any = {}) =>
      delegate.deleteMany({
        ...args,
        where: { ...(args.where ?? {}), tenantId },
      }),
  };
}
