import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../lib/errors";

/**
 * Must run after authMiddleware. Attaches req.tenantId from the verified JWT
 * payload — never from client input (params/body/query). Rejects requests
 * from SUPER_ADMIN users (who have no tenantId) since this middleware guards
 * tenant-scoped business routes only.
 */
export function tenantMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  if (!req.user.tenantId) {
    return next(new ForbiddenError("This action requires a tenant account"));
  }

  req.tenantId = req.user.tenantId;
  next();
}
