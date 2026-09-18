import { Request, Response } from "express";
import { idParam } from "../../lib/params";
import * as busesService from "./buses.service";

export async function listBusesHandler(req: Request, res: Response) {
  const buses = await busesService.listBuses(req.tenantId!, req.query as any);
  res.json(buses);
}

export async function getBusHandler(req: Request, res: Response) {
  const bus = await busesService.getBus(req.tenantId!, idParam(req));
  res.json(bus);
}

export async function createBusHandler(req: Request, res: Response) {
  const bus = await busesService.createBus(req.tenantId!, req.body);
  res.status(201).json(bus);
}

export async function updateBusHandler(req: Request, res: Response) {
  const bus = await busesService.updateBus(req.tenantId!, idParam(req), req.body);
  res.json(bus);
}

export async function deleteBusHandler(req: Request, res: Response) {
  await busesService.deleteBus(req.tenantId!, idParam(req));
  res.status(204).send();
}
