"use client";

import { ComponentType, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DataTable, Column } from "@/components/ui/DataTable";
import { useCanManageMasterData } from "@/lib/permissions";
import { ApiError } from "@/lib/api-client";

type WithStatus = { id: string; isActive: boolean };

interface FormProps<T, TPayload> {
  initialValues?: T;
  onSubmit: (payload: TPayload) => Promise<void>;
  onCancel: () => void;
}

interface MutationHooks<T, TPayload, TUpdate> {
  useList: () => { data: T[] | undefined; isLoading: boolean };
  useCreate: () => { mutateAsync: (payload: TPayload) => Promise<T> };
  useUpdate: () => {
    mutate: (args: { id: string; data: TUpdate }, opts?: { onError?: (err: unknown) => void }) => void;
    mutateAsync: (args: { id: string; data: TPayload }) => Promise<T>;
  };
  useDelete: () => { mutate: (id: string, opts?: { onError?: (err: unknown) => void }) => void };
}

interface ManagedResourceListPageProps<T extends WithStatus, TPayload, TUpdate>
  extends MutationHooks<T, TPayload, TUpdate> {
  title: string;
  addLabel: string;
  resourceLabel: string;
  columns: Column<T>[];
  getRowLabel: (row: T) => string;
  FormComponent: ComponentType<FormProps<T, TPayload>>;
}

/**
 * Shared shell for the tenant-facing master-data CRUD pages (Buses, Drivers,
 * Conductors, Routes): title + "Add" button + table + create/edit modal +
 * Edit/Deactivate/Delete actions (hidden for DATA_ENTRY). Each page supplies
 * only its column definitions, resource hooks, and form component.
 */
export function ManagedResourceListPage<T extends WithStatus, TPayload, TUpdate extends { isActive?: boolean }>({
  title,
  addLabel,
  resourceLabel,
  columns,
  getRowLabel,
  useList,
  useCreate,
  useUpdate,
  useDelete,
  FormComponent,
}: ManagedResourceListPageProps<T, TPayload, TUpdate>) {
  const { data, isLoading } = useList();
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();
  const canManage = useCanManageMasterData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: TPayload) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  };

  const toggleActive = (row: T) =>
    updateMutation.mutate({ id: row.id, data: { isActive: !row.isActive } as TUpdate });

  const handleDelete = (row: T) => {
    if (!confirm(`Delete ${resourceLabel.toLowerCase()} ${getRowLabel(row)}? This cannot be undone.`)) return;
    deleteMutation.mutate(row.id, {
      onError: (err) => alert(err instanceof ApiError ? err.message : "Delete failed"),
    });
  };

  const allColumns: Column<T>[] = canManage
    ? [
        ...columns,
        {
          header: "Actions",
          headerClassName: "px-4 py-3 text-right font-medium text-gray-500",
          cellClassName: "px-4 py-3 text-right",
          render: (row) => (
            <div className="flex justify-end gap-3 text-sm">
              <button onClick={() => openEdit(row)} className="text-indigo-600 hover:underline">
                Edit
              </button>
              <button onClick={() => toggleActive(row)} className="text-gray-600 hover:underline">
                {row.isActive ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => handleDelete(row)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          ),
        },
      ]
    : columns;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
        {canManage && <Button onClick={openCreate}>{addLabel}</Button>}
      </div>

      <DataTable
        columns={allColumns}
        data={data}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        emptyMessage={`No ${title.toLowerCase()} yet.`}
      />

      <Modal
        title={editing ? `Edit ${resourceLabel}` : `Add ${resourceLabel}`}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <FormComponent initialValues={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
