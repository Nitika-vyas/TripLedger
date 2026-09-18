"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { TenantFilter } from "./TenantFilter";

interface UseDataResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
}

interface ResourceListPageProps<T> {
  title: string;
  columns: Column<T>[];
  useData: (tenantId?: string) => UseDataResult<T>;
  getRowKey: (row: T) => string;
  emptyMessage?: string;
}

/**
 * Shared shell for the super-admin's read-only, cross-tenant list pages
 * (Buses, Drivers, Conductors, Routes, Trips): title + tenant filter + table.
 * Each page only supplies its column definitions and data hook.
 */
export function ResourceListPage<T>({
  title,
  columns,
  useData,
  getRowKey,
  emptyMessage,
}: ResourceListPageProps<T>) {
  const [tenantId, setTenantId] = useState("");
  const { data, isLoading } = useData(tenantId || undefined);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
        <TenantFilter value={tenantId} onChange={setTenantId} />
      </div>
      <DataTable columns={columns} data={data} isLoading={isLoading} getRowKey={getRowKey} emptyMessage={emptyMessage} />
    </div>
  );
}
