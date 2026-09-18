"use client";

import { useState } from "react";
import Link from "next/link";
import { useTenants, useCreateTenant, useUpdateTenantStatus } from "@/hooks/useTenants";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CreateTenantForm } from "@/components/super-admin/CreateTenantForm";
import { ApiError } from "@/lib/api-client";
import type { CreateTenantResult } from "@/types/tenant";

export default function TenantsPage() {
  const { data: tenants, isLoading } = useTenants();
  const createTenant = useCreateTenant();
  const updateStatus = useUpdateTenantStatus();

  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreateTenantResult | null>(null);

  const openCreate = () => {
    setError(null);
    setCreated(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCreated(null);
  };

  const handleCreate = async (payload: Parameters<typeof createTenant.mutateAsync>[0]) => {
    try {
      const result = await createTenant.mutateAsync(payload);
      setCreated(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  };

  const toggleStatus = (id: string, isActive: boolean) => updateStatus.mutate({ id, isActive: !isActive });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Tenants</h1>
        <Button onClick={openCreate}>+ Add Tenant</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Contact Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Users</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Buses</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Trips</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && tenants?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No tenants yet.
                </td>
              </tr>
            )}
            {tenants?.map((tenant) => (
              <tr key={tenant.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  <Link href={`/super-admin/tenants/${tenant.id}`} className="text-indigo-600 hover:underline">
                    {tenant.name}
                  </Link>
                  <div className="text-xs text-gray-400">{tenant.slug}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{tenant.contactEmail}</td>
                <td className="px-4 py-3 text-gray-600">{tenant._count.users}</td>
                <td className="px-4 py-3 text-gray-600">{tenant._count.buses}</td>
                <td className="px-4 py-3 text-gray-600">{tenant._count.trips}</td>
                <td className="px-4 py-3">
                  <StatusBadge isActive={tenant.isActive} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3 text-sm">
                    <Link href={`/super-admin/tenants/${tenant.id}`} className="text-indigo-600 hover:underline">
                      View
                    </Link>
                    <button
                      onClick={() => toggleStatus(tenant.id, tenant.isActive)}
                      className="text-gray-600 hover:underline"
                    >
                      {tenant.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal title="Add Tenant" isOpen={modalOpen} onClose={closeModal}>
        {created ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-green-700">
              Tenant <strong>{created.tenant.name}</strong> created successfully.
            </p>
            <div className="rounded-md bg-gray-50 p-4 text-sm">
              <div>
                <span className="text-gray-500">Admin email:</span> {created.admin.email}
              </div>
              {created.temporaryPassword && (
                <div className="mt-1">
                  <span className="text-gray-500">Temporary password:</span>{" "}
                  <code className="rounded bg-gray-200 px-1.5 py-0.5">{created.temporaryPassword}</code>
                  <p className="mt-1 text-xs text-gray-500">
                    Share this with the customer now — it won&apos;t be shown again.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={closeModal}>Done</Button>
            </div>
          </div>
        ) : (
          <>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <CreateTenantForm onSubmit={handleCreate} onCancel={closeModal} />
          </>
        )}
      </Modal>
    </div>
  );
}
