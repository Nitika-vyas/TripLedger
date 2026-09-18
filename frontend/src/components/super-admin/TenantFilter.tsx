"use client";

import { useTenants } from "@/hooks/useTenants";

interface TenantFilterProps {
  value: string;
  onChange: (tenantId: string) => void;
}

export function TenantFilter({ value, onChange }: TenantFilterProps) {
  const { data: tenants } = useTenants();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">All tenants</option>
      {tenants?.map((tenant) => (
        <option key={tenant.id} value={tenant.id}>
          {tenant.name}
        </option>
      ))}
    </select>
  );
}
