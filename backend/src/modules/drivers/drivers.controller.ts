import { Request, Response } from "express";
import { idParam } from "../../lib/params";
import * as driversService from "./drivers.service";

export async function listDriversHandler(req: Request, res: Response) {
  const drivers = await driversService.listDrivers(req.tenantId!, req.query as any);
  res.json(drivers);
}

export async function getDriverHandler(req: Request, res: Response) {
  const driver = await driversService.getDriver(req.tenantId!, idParam(req));
  res.json(driver);
}

export async function createDriverHandler(req: Request, res: Response) {
  const driver = await driversService.createDriver(req.tenantId!, req.body);
  res.status(201).json(driver);
}

export async function updateDriverHandler(req: Request, res: Response) {
  const driver = await driversService.updateDriver(req.tenantId!, idParam(req), req.body);
  res.json(driver);
}

export async function deleteDriverHandler(req: Request, res: Response) {
  await driversService.deleteDriver(req.tenantId!, idParam(req));
  res.status(204).send();
}
