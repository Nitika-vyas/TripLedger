"use client";

import { ManagedResourceListPage } from "@/components/master-data/ManagedResourceListPage";
import { useRoutes, useCreateRoute, useUpdateRoute, useDeleteRoute } from "@/hooks/useRoutes";
import { RouteForm } from "@/components/routes/RouteForm";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Column } from "@/components/ui/DataTable";
import type { BusRoute } from "@/types/master-data";

const columns: Column<BusRoute>[] = [
  { header: "Source", render: (r) => r.source, cellClassName: "px-4 py-3 font-medium text-gray-900" },
  { header: "Destination", render: (r) => r.destination },
  { header: "Distance (km)", render: (r) => r.distanceKm },
  { header: "Expected Fare", render: (r) => r.expectedFare ?? "—" },
  { header: "Status", render: (r) => <StatusBadge isActive={r.isActive} /> },
];

export default function RoutesPage() {
  return (
    <ManagedResourceListPage
      title="Routes"
      addLabel="+ Add Route"
      resourceLabel="Route"
      columns={columns}
      getRowLabel={(r) => `${r.source} → ${r.destination}`}
      useList={useRoutes}
      useCreate={useCreateRoute}
      useUpdate={useUpdateRoute}
      useDelete={useDeleteRoute}
      FormComponent={RouteForm}
    />
  );
}
