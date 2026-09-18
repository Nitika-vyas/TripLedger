import { Request, Response } from "express";
import * as dashboardService from "./dashboard.service";

export async function getDashboardSummaryHandler(req: Request, res: Response) {
  const summary = await dashboardService.getDashboardSummary(req.tenantId!, req.query as any);
  res.json(summary);
}
