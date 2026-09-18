import { NextFunction, Request, Response } from "express";
import type { TenantRole } from "@prisma/client";
import { ForbiddenError, UnauthorizedError } from "../lib/errors";

export function requireRole(...roles: TenantRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!req.user.role || !roles.includes(req.user.role)) {
      return next(new ForbiddenError("You do not have permission to perform this action"));
    }
    next();
  };
}

export function requireSuperAdmin() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.globalRole !== "SUPER_ADMIN") {
      return next(new ForbiddenError("Super admin access required"));
    }
    next();
  };
}
