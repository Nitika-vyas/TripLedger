"use client";

import { useState } from "react";
import { useTrips, TripFilters } from "@/hooks/useTrips";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Trip } from "@/types/trip";

const money = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function toQueryString(filters: TripFilters, format: string) {
  const usp = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) usp.set(key, value);
  });
  usp.set("format", format);
  return `?${usp.toString()}`;
}

const columns: Column<Trip>[] = [
  { header: "Date", render: (t) => new Date(t.tripDate).toLocaleDateString() },
  {
    header: "Route",
    render: (t) => `${t.route.source} → ${t.route.destination}`,
    cellClassName: "px-4 py-3 font-medium text-gray-900",
  },
  { header: "Bus", render: (t) => t.bus.busNumber },
  { header: "Passengers", render: (t) => t.passengerCount ?? "—" },
  { header: "Parcels", render: (t) => t.parcelCount ?? "—" },
  { header: "Status", render: (t) => t.status },
  { header: "Income", render: (t) => money(t.totalIncome) },
  { header: "Expense", render: (t) => money(t.totalExpense) },
  {
    header: "Profit",
    render: (t) => <span className={t.profit >= 0 ? "text-green-700" : "text-red-600"}>{money(t.profit)}</span>,
  },
];

export default function ReportsPage() {
  const [filters, setFilters] = useState<TripFilters>({});
  const { data: trips, isLoading } = useTrips(filters);
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const totalIncome = trips?.reduce((sum, t) => sum + t.totalIncome, 0) ?? 0;
  const totalExpense = trips?.reduce((sum, t) => sum + t.totalExpense, 0) ?? 0;

  const handleExport = async (format: "xlsx" | "pdf" | "csv") => {
    setExportError(null);
    setExporting(format);
    try {
      await apiClient.download(`/reports/trips/export${toQueryString(filters, format)}`, `trips-report.${format}`);
    } catch (err) {
      setExportError(err instanceof ApiError ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Reports</h1>

      <DateRangePicker
        value={filters}
        onChange={(range) => setFilters((f) => ({ ...f, ...range }))}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Trips in range" value={String(trips?.length ?? 0)} />
        <KpiCard label="Total Income" value={money(totalIncome)} />
        <KpiCard label="Net Profit" value={money(totalIncome - totalExpense)} tone={totalIncome - totalExpense < 0 ? "negative" : "positive"} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => handleExport("xlsx")} isLoading={exporting === "xlsx"}>
          Export Excel
        </Button>
        <Button variant="secondary" onClick={() => handleExport("pdf")} isLoading={exporting === "pdf"}>
          Export PDF
        </Button>
        <Button variant="secondary" onClick={() => handleExport("csv")} isLoading={exporting === "csv"}>
          Export CSV
        </Button>
        {exportError && <span className="text-sm text-red-600">{exportError}</span>}
      </div>

      <DataTable
        columns={columns}
        data={trips}
        isLoading={isLoading}
        getRowKey={(t) => t.id}
        emptyMessage="No trips in this period."
      />
    </div>
  );
}
