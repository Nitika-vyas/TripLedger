import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { dashboardQuerySchema } from "./dashboard.schema";
import { getDashboardSummaryHandler } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.use(authMiddleware, tenantMiddleware);

dashboardRouter.get("/summary", validate(dashboardQuerySchema, "query"), asyncHandler(getDashboardSummaryHandler));
