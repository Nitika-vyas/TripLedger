"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  createUserDefaultValues,
  toCreateUserPayload,
  CreateUserFormValues,
} from "@/schemas/user.schema";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";

interface CreateUserFormProps {
  onSubmit: (payload: ReturnType<typeof toCreateUserPayload>) => Promise<void>;
  onCancel: () => void;
}

export function CreateUserForm({ onSubmit, onCancel }: CreateUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: createUserDefaultValues,
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(toCreateUserPayload(values));
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField label="Full name" error={errors.fullName} {...register("fullName")} />
      <TextField label="Email (login)" type="email" error={errors.email} {...register("email")} />
      <TextField label="Phone (optional)" {...register("phone")} />
      <SelectField label="Role" error={errors.role} {...register("role")}>
        <option value="DATA_ENTRY">Data Entry</option>
        <option value="MANAGER">Manager</option>
        <option value="COMPANY_ADMIN">Company Admin</option>
      </SelectField>
      <TextField
        label="Password (optional — leave blank to auto-generate)"
        error={errors.password}
        {...register("password")}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create user
        </Button>
      </div>
    </form>
  );
}
