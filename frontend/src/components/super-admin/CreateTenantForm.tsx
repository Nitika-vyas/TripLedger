"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTenantSchema,
  createTenantDefaultValues,
  toCreateTenantPayload,
  CreateTenantFormValues,
} from "@/schemas/tenant.schema";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

interface CreateTenantFormProps {
  onSubmit: (payload: ReturnType<typeof toCreateTenantPayload>) => Promise<void>;
  onCancel: () => void;
}

export function CreateTenantForm({ onSubmit, onCancel }: CreateTenantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTenantFormValues>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: createTenantDefaultValues,
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(toCreateTenantPayload(values));
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField label="Company name" error={errors.companyName} {...register("companyName")} />
      <TextField
        label="Company contact email"
        type="email"
        error={errors.contactEmail}
        {...register("contactEmail")}
      />
      <TextField
        label="Company phone (optional)"
        error={errors.contactPhone}
        {...register("contactPhone")}
      />
      <hr className="my-1 border-gray-200" />
      <TextField
        label="Admin full name"
        error={errors.adminFullName}
        {...register("adminFullName")}
      />
      <TextField
        label="Admin email (login)"
        type="email"
        error={errors.adminEmail}
        {...register("adminEmail")}
      />
      <TextField
        label="Password (optional — leave blank to auto-generate)"
        type="text"
        error={errors.password}
        {...register("password")}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create tenant
        </Button>
      </div>
    </form>
  );
}
