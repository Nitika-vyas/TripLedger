"use client";

import { use } from "react";
import Link from "next/link";
import { useTenant, useUpdateTenantStatus } from "@/hooks/useTenants";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: tenant, isLoading } = useTenant(id);
  const updateStatus = useUpdateTenantStatus();

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading…</div>;
  }

  if (!tenant) {
    return <div className="text-sm text-gray-500">Tenant not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/super-admin/tenants" className="text-sm text-indigo-600 hover:underline">
          ← Back to tenants
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{tenant.name}</h1>
          <p className="text-sm text-gray-500">{tenant.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge isActive={tenant.isActive} />
          <Button
            variant="secondary"
            onClick={() => updateStatus.mutate({ id: tenant.id, isActive: !tenant.isActive })}
          >
            {tenant.isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-5 text-sm sm:grid-cols-5">
        <div>
          <div className="text-gray-500">Buses</div>
          <div className="text-xl font-semibold">{tenant._count.buses}</div>
        </div>
        <div>
          <div className="text-gray-500">Drivers</div>
          <div className="text-xl font-semibold">{tenant._count.drivers}</div>
        </div>
        <div>
          <div className="text-gray-500">Conductors</div>
          <div className="text-xl font-semibold">{tenant._count.conductors}</div>
        </div>
        <div>
          <div className="text-gray-500">Routes</div>
          <div className="text-xl font-semibold">{tenant._count.routes}</div>
        </div>
        <div>
          <div className="text-gray-500">Trips</div>
          <div className="text-xl font-semibold">{tenant._count.trips}</div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 text-sm">
        <div className="mb-3 font-medium text-gray-700">Contact</div>
        <div className="text-gray-600">{tenant.contactEmail}</div>
        {tenant.contactPhone && <div className="text-gray-600">{tenant.contactPhone}</div>}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3 font-medium text-gray-700">Users</div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tenant.users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{u.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-gray-600">{u.role}</td>
                <td className="px-4 py-3">
                  <StatusBadge isActive={u.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
