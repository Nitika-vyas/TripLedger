"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserSchema, toEditUserPayload, EditUserFormValues } from "@/schemas/user.schema";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";
import type { TenantUserRow } from "@/types/user";

interface EditUserFormProps {
  user: TenantUserRow;
  onSubmit: (payload: ReturnType<typeof toEditUserPayload>) => Promise<void>;
  onCancel: () => void;
}

export function EditUserForm({ user, onSubmit, onCancel }: EditUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: user.fullName,
      role: user.role,
      phone: user.phone ?? "",
      isActive: user.isActive,
      newPassword: "",
    },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(toEditUserPayload(values));
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField label="Full name" error={errors.fullName} {...register("fullName")} />
      <div className="text-sm text-gray-500">{user.email} (email can't be changed)</div>
      <TextField label="Phone" {...register("phone")} />
      <SelectField label="Role" error={errors.role} {...register("role")}>
        <option value="DATA_ENTRY">Data Entry</option>
        <option value="MANAGER">Manager</option>
        <option value="COMPANY_ADMIN">Company Admin</option>
      </SelectField>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" {...register("isActive")} />
        Active
      </label>
      <TextField
        label="Reset password (optional — leave blank to keep current)"
        error={errors.newPassword}
        {...register("newPassword")}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
