import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../lib/asyncHandler";
import { signupSchema, loginSchema } from "./auth.schema";
import {
  signupHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  meHandler,
} from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), asyncHandler(signupHandler));
authRouter.post("/login", validate(loginSchema), asyncHandler(loginHandler));
authRouter.post("/refresh", asyncHandler(refreshHandler));
authRouter.post("/logout", authMiddleware, asyncHandler(logoutHandler));
authRouter.get("/me", authMiddleware, asyncHandler(meHandler));
