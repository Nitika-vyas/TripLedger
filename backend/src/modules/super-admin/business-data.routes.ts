import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireSuperAdmin } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { listHandler } from "../../lib/list-handler";
import { superAdminListQuerySchema } from "../../lib/zod-helpers";
import * as businessDataService from "./business-data.service";

/**
 * Read-only, cross-tenant views of business data for the super admin.
 * Deliberately has no create/update/delete: managing a tenant's own fleet
 * data is that tenant's job — super admin can only observe it (and, via the
 * tenants module, activate/deactivate the tenant as a whole).
 */
export const superAdminBusinessDataRouter = Router();

superAdminBusinessDataRouter.use(authMiddleware, requireSuperAdmin());

const validateQuery = validate(superAdminListQuerySchema, "query");

const RESOURCES = {
  buses: businessDataService.listAllBuses,
  drivers: businessDataService.listAllDrivers,
  conductors: businessDataService.listAllConductors,
  routes: businessDataService.listAllRoutes,
  trips: businessDataService.listAllTrips,
};

for (const [path, serviceFn] of Object.entries(RESOURCES)) {
  superAdminBusinessDataRouter.get(`/${path}`, validateQuery, asyncHandler(listHandler(serviceFn)));
}
