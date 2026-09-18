import { Request, Response } from "express";
import * as authService from "./auth.service";
import { UnauthorizedError } from "../../lib/errors";

const REFRESH_COOKIE = "refreshToken";
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    path: "/api/auth",
  });
}

function sanitizeUser(user: any) {
  const { passwordHash, refreshTokenHash, ...rest } = user;
  return rest;
}

export async function signupHandler(req: Request, res: Response) {
  const result = await authService.signup(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({
    accessToken: result.accessToken,
    user: sanitizeUser(result.user),
    tenant: result.tenant,
  });
}

export async function loginHandler(req: Request, res: Response) {
  const result = await authService.login(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.json({ accessToken: result.accessToken, user: sanitizeUser(result.user) });
}

export async function refreshHandler(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) {
    throw new UnauthorizedError("Missing refresh token");
  }
  const result = await authService.refresh(token);
  setRefreshCookie(res, result.refreshToken);
  res.json({ accessToken: result.accessToken, user: sanitizeUser(result.user) });
}

export async function logoutHandler(req: Request, res: Response) {
  if (req.user) {
    await authService.logout(req.user.userId);
  }
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
  res.status(204).send();
}

export async function meHandler(req: Request, res: Response) {
  const me = await authService.getMe(req.user!.userId);
  res.json(me);
}
