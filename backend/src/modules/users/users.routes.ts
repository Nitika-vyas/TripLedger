import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { listQuerySchema } from "../../lib/zod-helpers";
import { createUserSchema, updateUserSchema } from "./users.schema";
import {
  listUsersHandler,
  getUserHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "./users.controller";

export const usersRouter = Router();

// Team management is sensitive (other people's accounts) — COMPANY_ADMIN only.
usersRouter.use(authMiddleware, tenantMiddleware, requireRole("COMPANY_ADMIN"));

usersRouter.get("/", validate(listQuerySchema, "query"), asyncHandler(listUsersHandler));
usersRouter.get("/:id", asyncHandler(getUserHandler));
usersRouter.post("/", validate(createUserSchema), asyncHandler(createUserHandler));
usersRouter.patch("/:id", validate(updateUserSchema), asyncHandler(updateUserHandler));
usersRouter.delete("/:id", asyncHandler(deleteUserHandler));
