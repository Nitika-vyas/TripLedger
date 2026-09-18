"use client";

import { ResourceListPage } from "@/components/super-admin/ResourceListPage";
import { useAllDrivers } from "@/hooks/useSuperAdminData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Column } from "@/components/ui/DataTable";
import type { AdminDriver } from "@/types/super-admin-data";

const columns: Column<AdminDriver>[] = [
  { header: "Tenant", render: (d) => d.tenant.name },
  { header: "Name", render: (d) => d.name, cellClassName: "px-4 py-3 font-medium text-gray-900" },
  { header: "Phone", render: (d) => d.phone ?? "—" },
  { header: "License", render: (d) => d.licenseNumber ?? "—" },
  { header: "Assigned Bus", render: (d) => d.assignedBus?.busNumber ?? "—" },
  { header: "Status", render: (d) => <StatusBadge isActive={d.isActive} /> },
];

export default function SuperAdminDriversPage() {
  return (
    <ResourceListPage
      title="Drivers (all tenants)"
      columns={columns}
      useData={useAllDrivers}
      getRowKey={(d) => d.id}
      emptyMessage="No drivers found."
    />
  );
}
