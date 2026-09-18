import { Request, Response } from "express";
import * as reportsService from "./reports.service";
import type { ExportTripsQuery } from "./reports.schema";

const MIME_TYPES: Record<ExportTripsQuery["format"], string> = {
  csv: "text/csv",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pdf: "application/pdf",
};

export async function exportTripsHandler(req: Request, res: Response) {
  const query = req.query as unknown as ExportTripsQuery;
  const { format } = query;

  res.setHeader("Content-Type", MIME_TYPES[format]);
  res.setHeader("Content-Disposition", `attachment; filename="trips-report.${format}"`);

  if (format === "csv") {
    res.send(await reportsService.generateTripsCsv(req.tenantId!, query));
  } else if (format === "pdf") {
    res.send(await reportsService.generateTripsPdf(req.tenantId!, query));
  } else {
    res.send(await reportsService.generateTripsXlsx(req.tenantId!, query));
  }
}
