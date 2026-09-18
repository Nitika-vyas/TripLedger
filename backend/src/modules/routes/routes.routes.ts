import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { listQuerySchema } from "../../lib/zod-helpers";
import { createRouteSchema, updateRouteSchema } from "./routes.schema";
import {
  listRoutesHandler,
  getRouteHandler,
  createRouteHandler,
  updateRouteHandler,
  deleteRouteHandler,
} from "./routes.controller";

export const routesRouter = Router();

routesRouter.use(authMiddleware, tenantMiddleware);

routesRouter.get("/", validate(listQuerySchema, "query"), asyncHandler(listRoutesHandler));
routesRouter.get("/:id", asyncHandler(getRouteHandler));

routesRouter.post(
  "/",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  validate(createRouteSchema),
  asyncHandler(createRouteHandler)
);
routesRouter.patch(
  "/:id",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  validate(updateRouteSchema),
  asyncHandler(updateRouteHandler)
);
routesRouter.delete(
  "/:id",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  asyncHandler(deleteRouteHandler)
);
