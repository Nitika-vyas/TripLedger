import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { exportTripsQuerySchema } from "./reports.schema";
import { exportTripsHandler } from "./reports.controller";

export const reportsRouter = Router();

reportsRouter.use(authMiddleware, tenantMiddleware);

reportsRouter.get("/trips/export", validate(exportTripsQuerySchema, "query"), asyncHandler(exportTripsHandler));
