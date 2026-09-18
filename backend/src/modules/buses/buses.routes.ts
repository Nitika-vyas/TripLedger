import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { listQuerySchema } from "../../lib/zod-helpers";
import { createBusSchema, updateBusSchema } from "./buses.schema";
import {
  listBusesHandler,
  getBusHandler,
  createBusHandler,
  updateBusHandler,
  deleteBusHandler,
} from "./buses.controller";

export const busesRouter = Router();

busesRouter.use(authMiddleware, tenantMiddleware);

busesRouter.get("/", validate(listQuerySchema, "query"), asyncHandler(listBusesHandler));
busesRouter.get("/:id", asyncHandler(getBusHandler));

busesRouter.post(
  "/",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  validate(createBusSchema),
  asyncHandler(createBusHandler)
);
busesRouter.patch(
  "/:id",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  validate(updateBusSchema),
  asyncHandler(updateBusHandler)
);
busesRouter.delete("/:id", requireRole("COMPANY_ADMIN", "MANAGER"), asyncHandler(deleteBusHandler));
