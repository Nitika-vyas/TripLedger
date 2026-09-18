import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { createTripSchema, updateTripSchema, listTripsQuerySchema } from "./trips.schema";
import {
  listTripsHandler,
  getTripHandler,
  createTripHandler,
  updateTripHandler,
  deleteTripHandler,
} from "./trips.controller";

export const tripsRouter = Router();

tripsRouter.use(authMiddleware, tenantMiddleware);

tripsRouter.get("/", validate(listTripsQuerySchema, "query"), asyncHandler(listTripsHandler));
tripsRouter.get("/:id", asyncHandler(getTripHandler));

// Data entry is literally this role's job — COMPANY_ADMIN/MANAGER/DATA_ENTRY can all record trips.
tripsRouter.post(
  "/",
  requireRole("COMPANY_ADMIN", "MANAGER", "DATA_ENTRY"),
  validate(createTripSchema),
  asyncHandler(createTripHandler)
);
tripsRouter.patch(
  "/:id",
  requireRole("COMPANY_ADMIN", "MANAGER", "DATA_ENTRY"),
  validate(updateTripSchema),
  asyncHandler(updateTripHandler)
);
// Deleting a financial record stays admin/manager-only.
tripsRouter.delete("/:id", requireRole("COMPANY_ADMIN", "MANAGER"), asyncHandler(deleteTripHandler));
