import { Request, Response } from "express";
import { idParam } from "../../lib/params";
import * as conductorsService from "./conductors.service";

export async function listConductorsHandler(req: Request, res: Response) {
  const conductors = await conductorsService.listConductors(req.tenantId!, req.query as any);
  res.json(conductors);
}

export async function getConductorHandler(req: Request, res: Response) {
  const conductor = await conductorsService.getConductor(req.tenantId!, idParam(req));
  res.json(conductor);
}

export async function createConductorHandler(req: Request, res: Response) {
  const conductor = await conductorsService.createConductor(req.tenantId!, req.body);
  res.status(201).json(conductor);
}

export async function updateConductorHandler(req: Request, res: Response) {
  const conductor = await conductorsService.updateConductor(req.tenantId!, idParam(req), req.body);
  res.json(conductor);
}

export async function deleteConductorHandler(req: Request, res: Response) {
  await conductorsService.deleteConductor(req.tenantId!, idParam(req));
  res.status(204).send();
}
