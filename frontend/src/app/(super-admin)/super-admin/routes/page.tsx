"use client";

import { ResourceListPage } from "@/components/super-admin/ResourceListPage";
import { useAllRoutes } from "@/hooks/useSuperAdminData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Column } from "@/components/ui/DataTable";
import type { AdminRoute } from "@/types/super-admin-data";

const columns: Column<AdminRoute>[] = [
  { header: "Tenant", render: (r) => r.tenant.name },
  { header: "Source", render: (r) => r.source, cellClassName: "px-4 py-3 font-medium text-gray-900" },
  { header: "Destination", render: (r) => r.destination },
  { header: "Distance (km)", render: (r) => r.distanceKm },
  { header: "Expected Fare", render: (r) => r.expectedFare ?? "—" },
  { header: "Status", render: (r) => <StatusBadge isActive={r.isActive} /> },
];

export default function SuperAdminRoutesPage() {
  return (
    <ResourceListPage
      title="Routes (all tenants)"
      columns={columns}
      useData={useAllRoutes}
      getRowKey={(r) => r.id}
      emptyMessage="No routes found."
    />
  );
}
