import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { listQuerySchema } from "../../lib/zod-helpers";
import { createConductorSchema, updateConductorSchema } from "./conductors.schema";
import {
  listConductorsHandler,
  getConductorHandler,
  createConductorHandler,
  updateConductorHandler,
  deleteConductorHandler,
} from "./conductors.controller";

export const conductorsRouter = Router();

conductorsRouter.use(authMiddleware, tenantMiddleware);

conductorsRouter.get("/", validate(listQuerySchema, "query"), asyncHandler(listConductorsHandler));
conductorsRouter.get("/:id", asyncHandler(getConductorHandler));

conductorsRouter.post(
  "/",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  validate(createConductorSchema),
  asyncHandler(createConductorHandler)
);
conductorsRouter.patch(
  "/:id",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  validate(updateConductorSchema),
  asyncHandler(updateConductorHandler)
);
conductorsRouter.delete(
  "/:id",
  requireRole("COMPANY_ADMIN", "MANAGER"),
  asyncHandler(deleteConductorHandler)
);
