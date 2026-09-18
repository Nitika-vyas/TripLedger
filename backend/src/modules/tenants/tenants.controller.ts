import { Request, Response } from "express";
import { idParam } from "../../lib/params";
import * as tenantsService from "./tenants.service";

export async function listTenantsHandler(_req: Request, res: Response) {
  const tenants = await tenantsService.listTenants();
  res.json(tenants);
}

export async function getTenantHandler(req: Request, res: Response) {
  const tenant = await tenantsService.getTenant(idParam(req));
  res.json(tenant);
}

export async function createTenantHandler(req: Request, res: Response) {
  const result = await tenantsService.createTenant(req.body);
  res.status(201).json(result);
}

export async function updateTenantStatusHandler(req: Request, res: Response) {
  const tenant = await tenantsService.updateTenantStatus(idParam(req), req.body.isActive);
  res.json(tenant);
}
