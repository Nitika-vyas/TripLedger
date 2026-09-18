import { Request, Response } from "express";
import { idParam } from "../../lib/params";
import * as usersService from "./users.service";

export async function listUsersHandler(req: Request, res: Response) {
  const users = await usersService.listUsers(req.tenantId!, req.query as any);
  res.json(users);
}

export async function getUserHandler(req: Request, res: Response) {
  const user = await usersService.getUser(req.tenantId!, idParam(req));
  res.json(user);
}

export async function createUserHandler(req: Request, res: Response) {
  const result = await usersService.createUser(req.tenantId!, req.body);
  res.status(201).json(result);
}

export async function updateUserHandler(req: Request, res: Response) {
  const user = await usersService.updateUser(req.tenantId!, idParam(req), req.user!.userId, req.body);
  res.json(user);
}

export async function deleteUserHandler(req: Request, res: Response) {
  await usersService.deleteUser(req.tenantId!, idParam(req), req.user!.userId);
  res.status(204).send();
}
