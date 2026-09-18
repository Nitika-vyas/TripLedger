"use client";

import { ResourceListPage } from "@/components/super-admin/ResourceListPage";
import { useAllTrips } from "@/hooks/useSuperAdminData";
import type { Column } from "@/components/ui/DataTable";
import type { AdminTrip } from "@/types/super-admin-data";

const STATUS_STYLES: Record<AdminTrip["status"], string> = {
  COMPLETED: "bg-green-100 text-green-800",
  SCHEDULED: "bg-indigo-100 text-indigo-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

const columns: Column<AdminTrip>[] = [
  { header: "Tenant", render: (t) => t.tenant.name },
  { header: "Date", render: (t) => new Date(t.tripDate).toLocaleDateString() },
  { header: "Bus", render: (t) => t.bus.busNumber, cellClassName: "px-4 py-3 font-medium text-gray-900" },
  { header: "Route", render: (t) => `${t.route.source} → ${t.route.destination}` },
  { header: "Driver", render: (t) => t.driver?.name ?? "—" },
  { header: "Passengers", render: (t) => t.passengerCount ?? "—" },
  { header: "Parcels", render: (t) => t.parcelCount ?? "—" },
  {
    header: "Status",
    render: (t) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[t.status]}`}>
        {t.status}
      </span>
    ),
  },
];

export default function SuperAdminTripsPage() {
  return (
    <ResourceListPage
      title="Trips (all tenants)"
      columns={columns}
      useData={useAllTrips}
      getRowKey={(t) => t.id}
      emptyMessage="No trips recorded yet."
    />
  );
}
