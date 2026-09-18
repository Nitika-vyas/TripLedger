"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/useUsers";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DataTable, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CreateUserForm } from "@/components/users/CreateUserForm";
import { EditUserForm } from "@/components/users/EditUserForm";
import { ApiError } from "@/lib/api-client";
import type { CreateUserResult, TenantUserRow } from "@/types/user";

const ROLE_LABELS: Record<TenantUserRow["role"], string> = {
  COMPANY_ADMIN: "Company Admin",
  MANAGER: "Manager",
  DATA_ENTRY: "Data Entry",
};

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; user: TenantUserRow };

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const isAdmin = currentUser?.role === "COMPANY_ADMIN";

  useEffect(() => {
    if (currentUser && !isAdmin) router.replace("/dashboard");
  }, [currentUser, isAdmin, router]);

  const { data: users, isLoading } = useUsers(isAdmin);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  if (currentUser && !isAdmin) {
    return <div className="text-sm text-gray-500">Redirecting…</div>;
  }

  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreateUserResult | null>(null);

  const closeModal = () => {
    setModal({ mode: "closed" });
    setCreated(null);
    setError(null);
  };

  const handleCreate = async (payload: Parameters<typeof createUser.mutateAsync>[0]) => {
    try {
      const result = await createUser.mutateAsync(payload);
      setCreated(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  };

  const handleEdit = async (id: string, payload: Parameters<typeof updateUser.mutateAsync>[0]["data"]) => {
    try {
      await updateUser.mutateAsync({ id, data: payload });
      closeModal();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  };

  const handleDelete = (row: TenantUserRow) => {
    if (!confirm(`Delete user ${row.fullName}? This cannot be undone.`)) return;
    deleteUser.mutate(row.id, {
      onError: (err) => alert(err instanceof ApiError ? err.message : "Delete failed"),
    });
  };

  const columns: Column<TenantUserRow>[] = [
    { header: "Name", render: (u) => u.fullName, cellClassName: "px-4 py-3 font-medium text-gray-900" },
    { header: "Email", render: (u) => u.email },
    { header: "Role", render: (u) => ROLE_LABELS[u.role] },
    { header: "Status", render: (u) => <StatusBadge isActive={u.isActive} /> },
    {
      header: "Actions",
      headerClassName: "px-4 py-3 text-right font-medium text-gray-500",
      cellClassName: "px-4 py-3 text-right",
      render: (u) => {
        const isSelf = u.id === currentUser?.id;
        return (
          <div className="flex justify-end gap-3 text-sm">
            <button
              onClick={() => setModal({ mode: "edit", user: u })}
              disabled={isSelf}
              className={isSelf ? "text-gray-300" : "text-indigo-600 hover:underline"}
              title={isSelf ? "You can't edit your own account here" : undefined}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(u)}
              disabled={isSelf}
              className={isSelf ? "text-gray-300" : "text-red-600 hover:underline"}
              title={isSelf ? "You can't delete your own account" : undefined}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Users</h1>
        <Button onClick={() => setModal({ mode: "create" })}>+ Add User</Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        getRowKey={(u) => u.id}
        emptyMessage="No users yet."
      />

      <Modal
        title={modal.mode === "edit" ? "Edit User" : "Add User"}
        isOpen={modal.mode !== "closed"}
        onClose={closeModal}
      >
        {modal.mode === "create" &&
          (created ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-green-700">
                User <strong>{created.user.fullName}</strong> created successfully.
              </p>
              <div className="rounded-md bg-gray-50 p-4 text-sm">
                <div>
                  <span className="text-gray-500">Login email:</span> {created.user.email}
                </div>
                {created.temporaryPassword && (
                  <div className="mt-1">
                    <span className="text-gray-500">Temporary password:</span>{" "}
                    <code className="rounded bg-gray-200 px-1.5 py-0.5">{created.temporaryPassword}</code>
                    <p className="mt-1 text-xs text-gray-500">
                      Share this with them now — it won&apos;t be shown again.
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
              <CreateUserForm onSubmit={handleCreate} onCancel={closeModal} />
            </>
          ))}

        {modal.mode === "edit" && (
          <>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <EditUserForm
              user={modal.user}
              onSubmit={(payload) => handleEdit(modal.user.id, payload)}
              onCancel={closeModal}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
