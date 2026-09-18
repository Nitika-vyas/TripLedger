"use client";

import { ManagedResourceListPage } from "@/components/master-data/ManagedResourceListPage";
import { useBuses, useCreateBus, useUpdateBus, useDeleteBus } from "@/hooks/useBuses";
import { BusForm } from "@/components/buses/BusForm";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Column } from "@/components/ui/DataTable";
import type { Bus } from "@/types/master-data";

const columns: Column<Bus>[] = [
  { header: "Bus Number", render: (b) => b.busNumber, cellClassName: "px-4 py-3 font-medium text-gray-900" },
  { header: "Type", render: (b) => b.type },
  { header: "Capacity", render: (b) => b.capacity },
  { header: "Ownership", render: (b) => b.ownership },
  { header: "Status", render: (b) => <StatusBadge isActive={b.isActive} /> },
];

export default function BusesPage() {
  return (
    <ManagedResourceListPage
      title="Buses"
      addLabel="+ Add Bus"
      resourceLabel="Bus"
      columns={columns}
      getRowLabel={(b) => b.busNumber}
      useList={useBuses}
      useCreate={useCreateBus}
      useUpdate={useUpdateBus}
      useDelete={useDeleteBus}
      FormComponent={BusForm}
    />
  );
}
