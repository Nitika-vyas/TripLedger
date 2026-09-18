import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireSuperAdmin } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { createTenantSchema, updateTenantStatusSchema } from "./tenants.schema";
import {
  listTenantsHandler,
  getTenantHandler,
  createTenantHandler,
  updateTenantStatusHandler,
} from "./tenants.controller";

export const tenantsRouter = Router();

tenantsRouter.use(authMiddleware, requireSuperAdmin());

tenantsRouter.get("/", asyncHandler(listTenantsHandler));
tenantsRouter.get("/:id", asyncHandler(getTenantHandler));
tenantsRouter.post("/", validate(createTenantSchema), asyncHandler(createTenantHandler));
tenantsRouter.patch(
  "/:id",
  validate(updateTenantStatusSchema),
  asyncHandler(updateTenantStatusHandler)
);
