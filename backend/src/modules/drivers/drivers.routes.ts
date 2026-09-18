import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { listQuerySchema } from "../../lib/zod-helpers";
import { createDriverSchema, updateDriverSchema } from "./drivers.schema";
import {
  listDriversHandler,
  getDriverHandler,
  createDriverHandler,
  updateDriverHandler,
  deleteDriverHandler,
} from "./drivers.controller";

export const driversRouter = Router();

driversRouter.use(authMiddleware, tenantMiddleware);

driversRouter.get("/", validate(listQuerySchema, "query"), asyncHandler(listDriversHandler));
driversRouter.get("/:id", asyncHandler(getDriverHandler));

driversRouter.post(
  "/",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  validate(createDriverSchema),
  asyncHandler(createDriverHandler)
);
driversRouter.patch(
  "/:id",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  validate(updateDriverSchema),
  asyncHandler(updateDriverHandler)
);
driversRouter.delete(
  "/:id",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  asyncHandler(deleteDriverHandler)
);
