"use client";

import { ResourceListPage } from "@/components/super-admin/ResourceListPage";
import { useAllConductors } from "@/hooks/useSuperAdminData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Column } from "@/components/ui/DataTable";
import type { AdminConductor } from "@/types/super-admin-data";

const columns: Column<AdminConductor>[] = [
  { header: "Tenant", render: (c) => c.tenant.name },
  { header: "Name", render: (c) => c.name, cellClassName: "px-4 py-3 font-medium text-gray-900" },
  { header: "Phone", render: (c) => c.phone ?? "—" },
  { header: "Assigned Bus", render: (c) => c.assignedBus?.busNumber ?? "—" },
  { header: "Status", render: (c) => <StatusBadge isActive={c.isActive} /> },
];

export default function SuperAdminConductorsPage() {
  return (
    <ResourceListPage
      title="Conductors (all tenants)"
      columns={columns}
      useData={useAllConductors}
      getRowKey={(c) => c.id}
      emptyMessage="No conductors found."
    />
  );
}
