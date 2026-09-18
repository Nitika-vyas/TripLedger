import { Request, Response } from "express";
import { idParam } from "../../lib/params";
import * as routesService from "./routes.service";

export async function listRoutesHandler(req: Request, res: Response) {
  const routes = await routesService.listRoutes(req.tenantId!, req.query as any);
  res.json(routes);
}

export async function getRouteHandler(req: Request, res: Response) {
  const route = await routesService.getRoute(req.tenantId!, idParam(req));
  res.json(route);
}

export async function createRouteHandler(req: Request, res: Response) {
  const route = await routesService.createRoute(req.tenantId!, req.body);
  res.status(201).json(route);
}

export async function updateRouteHandler(req: Request, res: Response) {
  const route = await routesService.updateRoute(req.tenantId!, idParam(req), req.body);
  res.json(route);
}

export async function deleteRouteHandler(req: Request, res: Response) {
  await routesService.deleteRoute(req.tenantId!, idParam(req));
  res.status(204).send();
}
