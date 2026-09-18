import { Prisma } from "@prisma/client";
import { ConflictError } from "./errors";

/**
 * Re-throws a Prisma FK-constraint violation (P2003) — e.g. deleting a Bus
 * that still has Trips — as a friendly ConflictError instead of a raw 500.
 */
export function rethrowFkConflict(err: unknown, message: string): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
    throw new ConflictError(message);
  }
  throw err;
}
