"use client";

import { ManagedResourceListPage } from "@/components/master-data/ManagedResourceListPage";
import {
  useConductors,
  useCreateConductor,
  useUpdateConductor,
  useDeleteConductor,
} from "@/hooks/useConductors";
import { ConductorForm } from "@/components/conductors/ConductorForm";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Column } from "@/components/ui/DataTable";
import type { Conductor } from "@/types/master-data";

const columns: Column<Conductor>[] = [
  { header: "Name", render: (c) => c.name, cellClassName: "px-4 py-3 font-medium text-gray-900" },
  { header: "Phone", render: (c) => c.phone ?? "—" },
  { header: "Assigned Bus", render: (c) => c.assignedBus?.busNumber ?? "—" },
  { header: "Status", render: (c) => <StatusBadge isActive={c.isActive} /> },
];

export default function ConductorsPage() {
  return (
    <ManagedResourceListPage
      title="Conductors"
      addLabel="+ Add Conductor"
      resourceLabel="Conductor"
      columns={columns}
      getRowLabel={(c) => c.name}
      useList={useConductors}
      useCreate={useCreateConductor}
      useUpdate={useUpdateConductor}
      useDelete={useDeleteConductor}
      FormComponent={ConductorForm}
    />
  );
}
