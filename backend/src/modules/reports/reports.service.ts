import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { prisma } from "../../config/prisma";
import { listTrips } from "../trips/trips.service";
import type { ListTripsQuery } from "../trips/trips.schema";
import type { ExportTripsQuery } from "./reports.schema";

async function fetchTripsForExport(tenantId: string, query: ExportTripsQuery) {
  return listTrips(tenantId, query as ListTripsQuery, undefined);
}

function csvEscape(value: unknown): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function generateTripsCsv(tenantId: string, query: ExportTripsQuery): Promise<string> {
  const trips = await fetchTripsForExport(tenantId, query);
  const header = [
    "Date",
    "Route",
    "Bus",
    "Driver",
    "Status",
    "Passengers",
    "Parcels",
    "Ticket Sales",
    "Other Income",
    "Total Income",
    "Total Expense",
    "Profit",
  ];
  const rows = trips.map((t) => [
    t.tripDate.toISOString().slice(0, 10),
    `${t.route.source} -> ${t.route.destination}`,
    t.bus.busNumber,
    t.driver?.name ?? "",
    t.status,
    t.passengerCount ?? "",
    t.parcelCount ?? "",
    t.income ? Number(t.income.ticketSales) : 0,
    t.income ? Number(t.income.otherIncome) : 0,
    t.totalIncome,
    t.totalExpense,
    t.profit,
  ]);
  return [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

export async function generateTripsXlsx(tenantId: string, query: ExportTripsQuery): Promise<Buffer> {
  const trips = await fetchTripsForExport(tenantId, query);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "TripLedger";
  const sheet = workbook.addWorksheet("Trips");

  sheet.columns = [
    { header: "Date", key: "date", width: 12 },
    { header: "Route", key: "route", width: 28 },
    { header: "Bus", key: "bus", width: 16 },
    { header: "Driver", key: "driver", width: 18 },
    { header: "Status", key: "status", width: 12 },
    { header: "Passengers", key: "passengerCount", width: 12 },
    { header: "Parcels", key: "parcelCount", width: 10 },
    { header: "Ticket Sales", key: "ticketSales", width: 14 },
    { header: "Other Income", key: "otherIncome", width: 14 },
    { header: "Total Income", key: "totalIncome", width: 14 },
    { header: "Total Expense", key: "totalExpense", width: 14 },
    { header: "Profit", key: "profit", width: 14 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const t of trips) {
    sheet.addRow({
      date: t.tripDate.toISOString().slice(0, 10),
      route: `${t.route.source} → ${t.route.destination}`,
      bus: t.bus.busNumber,
      driver: t.driver?.name ?? "—",
      status: t.status,
      passengerCount: t.passengerCount ?? "",
      parcelCount: t.parcelCount ?? "",
      ticketSales: t.income ? Number(t.income.ticketSales) : 0,
      otherIncome: t.income ? Number(t.income.otherIncome) : 0,
      totalIncome: t.totalIncome,
      totalExpense: t.totalExpense,
      profit: t.profit,
    });
  }

  const totalIncome = trips.reduce((sum, t) => sum + t.totalIncome, 0);
  const totalExpense = trips.reduce((sum, t) => sum + t.totalExpense, 0);
  sheet.addRow({});
  const totalsRow = sheet.addRow({ route: "TOTAL", totalIncome, totalExpense, profit: totalIncome - totalExpense });
  totalsRow.font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

const PDF_COLUMNS = [
  { label: "Date", width: 65 },
  { label: "Route", width: 170 },
  { label: "Bus", width: 90 },
  { label: "Driver", width: 100 },
  { label: "Status", width: 70 },
  { label: "Income", width: 80 },
  { label: "Expense", width: 80 },
  { label: "Profit", width: 80 },
];

export async function generateTripsPdf(tenantId: string, query: ExportTripsQuery): Promise<Buffer> {
  const trips = await fetchTripsForExport(tenantId, query);
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { name: true } });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).fillColor("#111").text("TripLedger — Trip Report");
    doc.fontSize(10).fillColor("#555").text(tenant?.name ?? "");
    if (query.dateFrom || query.dateTo) {
      doc.text(`Period: ${query.dateFrom ?? "…"} to ${query.dateTo ?? "…"}`);
    }
    doc.moveDown();

    const totalIncome = trips.reduce((sum, t) => sum + t.totalIncome, 0);
    const totalExpense = trips.reduce((sum, t) => sum + t.totalExpense, 0);
    doc
      .fillColor("#000")
      .fontSize(11)
      .text(
        `Total trips: ${trips.length}    Total income: ${totalIncome.toFixed(2)}    ` +
          `Total expense: ${totalExpense.toFixed(2)}    Net profit: ${(totalIncome - totalExpense).toFixed(2)}`
      );
    doc.moveDown();

    const startX = doc.page.margins.left;
    let y = doc.y;

    function drawRow(values: string[], bold = false) {
      let x = startX;
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(9);
      values.forEach((value, i) => {
        doc.text(value, x, y, { width: PDF_COLUMNS[i].width, ellipsis: true });
        x += PDF_COLUMNS[i].width;
      });
      y += 18;
      if (y > doc.page.height - doc.page.margins.bottom - 30) {
        doc.addPage({ margin: 40, size: "A4", layout: "landscape" });
        y = doc.page.margins.top;
      }
    }

    drawRow(PDF_COLUMNS.map((c) => c.label), true);
    for (const t of trips) {
      drawRow([
        t.tripDate.toISOString().slice(0, 10),
        `${t.route.source} -> ${t.route.destination}`,
        t.bus.busNumber,
        t.driver?.name ?? "—",
        t.status,
        t.totalIncome.toFixed(2),
        t.totalExpense.toFixed(2),
        t.profit.toFixed(2),
      ]);
    }

    doc.end();
  });
}
