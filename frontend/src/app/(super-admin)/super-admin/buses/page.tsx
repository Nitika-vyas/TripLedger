"use client";

import { ResourceListPage } from "@/components/super-admin/ResourceListPage";
import { useAllBuses } from "@/hooks/useSuperAdminData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Column } from "@/components/ui/DataTable";
import type { AdminBus } from "@/types/super-admin-data";

const columns: Column<AdminBus>[] = [
  { header: "Tenant", render: (b) => b.tenant.name },
  { header: "Bus Number", render: (b) => b.busNumber, cellClassName: "px-4 py-3 font-medium text-gray-900" },
  { header: "Type", render: (b) => b.type },
  { header: "Capacity", render: (b) => b.capacity },
  { header: "Ownership", render: (b) => b.ownership },
  { header: "Status", render: (b) => <StatusBadge isActive={b.isActive} /> },
];

export default function SuperAdminBusesPage() {
  return (
    <ResourceListPage
      title="Buses (all tenants)"
      columns={columns}
      useData={useAllBuses}
      getRowKey={(b) => b.id}
      emptyMessage="No buses found."
    />
  );
}
