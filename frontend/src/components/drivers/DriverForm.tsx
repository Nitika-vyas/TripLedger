"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  driverSchema,
  driverDefaultValues,
  toDriverPayload,
  DriverFormValues,
} from "@/schemas/driver.schema";
import { useBuses } from "@/hooks/useBuses";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";
import type { Driver } from "@/types/master-data";

interface DriverFormProps {
  initialValues?: Driver;
  onSubmit: (payload: ReturnType<typeof toDriverPayload>) => Promise<void>;
  onCancel: () => void;
}

function toFormValues(driver?: Driver): DriverFormValues {
  if (!driver) return driverDefaultValues;
  return {
    name: driver.name,
    phone: driver.phone ?? "",
    licenseNumber: driver.licenseNumber ?? "",
    licenseExpiry: driver.licenseExpiry?.slice(0, 10) ?? "",
    salaryRate: driver.salaryRate ?? "",
    allowanceRate: driver.allowanceRate ?? "",
    assignedBusId: driver.assignedBusId ?? "",
  };
}

export function DriverForm({ initialValues, onSubmit, onCancel }: DriverFormProps) {
  const { data: buses } = useBuses({ isActive: true });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: toFormValues(initialValues),
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(toDriverPayload(values));
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField label="Full name" error={errors.name} {...register("name")} />
      <TextField label="Phone" error={errors.phone} {...register("phone")} />
      <TextField label="License number" error={errors.licenseNumber} {...register("licenseNumber")} />
      <TextField label="License expiry" type="date" {...register("licenseExpiry")} />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Salary rate" type="number" step="0.01" {...register("salaryRate")} />
        <TextField label="Allowance rate" type="number" step="0.01" {...register("allowanceRate")} />
      </div>
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
