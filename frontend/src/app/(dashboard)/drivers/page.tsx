"use client";

import { ManagedResourceListPage } from "@/components/master-data/ManagedResourceListPage";
import { useDrivers, useCreateDriver, useUpdateDriver, useDeleteDriver } from "@/hooks/useDrivers";
import { DriverForm } from "@/components/drivers/DriverForm";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Column } from "@/components/ui/DataTable";
import type { Driver } from "@/types/master-data";

const columns: Column<Driver>[] = [
  { header: "Name", render: (d) => d.name, cellClassName: "px-4 py-3 font-medium text-gray-900" },
  { header: "Phone", render: (d) => d.phone ?? "—" },
  { header: "License", render: (d) => d.licenseNumber ?? "—" },
  { header: "Assigned Bus", render: (d) => d.assignedBus?.busNumber ?? "—" },
  { header: "Status", render: (d) => <StatusBadge isActive={d.isActive} /> },
];

export default function DriversPage() {
  return (
    <ManagedResourceListPage
      title="Drivers"
      addLabel="+ Add Driver"
      resourceLabel="Driver"
      columns={columns}
      getRowLabel={(d) => d.name}
      useList={useDrivers}
      useCreate={useCreateDriver}
      useUpdate={useUpdateDriver}
      useDelete={useDeleteDriver}
      FormComponent={DriverForm}
    />
  );
}
