"use client";

import Link from "next/link";
import { Building2, CheckCircle2, Users, Bus as BusIcon, Route as RouteIcon } from "lucide-react";
import { useTenants } from "@/hooks/useTenants";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function SuperAdminOverviewPage() {
  const { data: tenants, isLoading } = useTenants();

  const totals = (tenants ?? []).reduce(
    (acc, t) => {
      acc.tenants += 1;
      acc.activeTenants += t.isActive ? 1 : 0;
      acc.users += t._count.users;
      acc.buses += t._count.buses;
      acc.trips += t._count.trips;
      return acc;
    },
    { tenants: 0, activeTenants: 0, users: 0, buses: 0, trips: 0 }
  );

  const recentTenants = [...(tenants ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Platform-wide activity across every tenant.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total Tenants" value={isLoading ? "—" : String(totals.tenants)} icon={Building2} />
        <KpiCard label="Active Tenants" value={isLoading ? "—" : String(totals.activeTenants)} icon={CheckCircle2} />
        <KpiCard label="Total Users" value={isLoading ? "—" : String(totals.users)} icon={Users} />
        <KpiCard label="Total Buses" value={isLoading ? "—" : String(totals.buses)} icon={BusIcon} />
        <KpiCard label="Total Trips" value={isLoading ? "—" : String(totals.trips)} icon={RouteIcon} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
          <span className="font-semibold text-gray-800">Recently added tenants</span>
          <Link href="/super-admin/tenants" className="text-sm font-medium text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Contact Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Created</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && recentTenants.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No tenants yet.
                </td>
              </tr>
            )}
            {recentTenants.map((tenant) => (
              <tr key={tenant.id} className="transition-colors hover:bg-indigo-50/40">
                <td className="px-4 py-3 font-medium text-gray-900">
                  <Link href={`/super-admin/tenants/${tenant.id}`} className="text-indigo-600 hover:underline">
                    {tenant.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{tenant.contactEmail}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge isActive={tenant.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
