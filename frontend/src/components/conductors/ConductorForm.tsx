"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  conductorSchema,
  conductorDefaultValues,
  toConductorPayload,
  ConductorFormValues,
} from "@/schemas/conductor.schema";
import { useBuses } from "@/hooks/useBuses";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";
import type { Conductor } from "@/types/master-data";

interface ConductorFormProps {
  initialValues?: Conductor;
  onSubmit: (payload: ReturnType<typeof toConductorPayload>) => Promise<void>;
  onCancel: () => void;
}

function toFormValues(conductor?: Conductor): ConductorFormValues {
  if (!conductor) return conductorDefaultValues;
  return {
    name: conductor.name,
    phone: conductor.phone ?? "",
    allowanceRate: conductor.allowanceRate ?? "",
    assignedBusId: conductor.assignedBusId ?? "",
  };
}

export function ConductorForm({ initialValues, onSubmit, onCancel }: ConductorFormProps) {
  const { data: buses } = useBuses({ isActive: true });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConductorFormValues>({
    resolver: zodResolver(conductorSchema),
    defaultValues: toFormValues(initialValues),
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(toConductorPayload(values));
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField label="Full name" error={errors.name} {...register("name")} />
      <TextField label="Phone" error={errors.phone} {...register("phone")} />
      <TextField label="Allowance rate" type="number" step="0.01" {...register("allowanceRate")} />
      <SelectField label="Assigned bus" {...register("assignedBusId")}>
        <option value="">— Unassigned —</option>
        {buses?.map((bus) => (
          <option key={bus.id} value={bus.id}>
            {bus.busNumber}
          </option>
        ))}
      </SelectField>
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
