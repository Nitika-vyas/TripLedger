"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { busSchema, busDefaultValues, toBusPayload, BusFormValues } from "@/schemas/bus.schema";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";
import type { Bus } from "@/types/master-data";

interface BusFormProps {
  initialValues?: Bus;
  onSubmit: (payload: ReturnType<typeof toBusPayload>) => Promise<void>;
  onCancel: () => void;
}

function toFormValues(bus?: Bus): BusFormValues {
  if (!bus) return busDefaultValues;
  return {
    busNumber: bus.busNumber,
    type: bus.type,
    capacity: String(bus.capacity),
    ownership: bus.ownership,
    insuranceExpiry: bus.insuranceExpiry?.slice(0, 10) ?? "",
    fitnessExpiry: bus.fitnessExpiry?.slice(0, 10) ?? "",
    permitExpiry: bus.permitExpiry?.slice(0, 10) ?? "",
    pucExpiry: bus.pucExpiry?.slice(0, 10) ?? "",
  };
}

export function BusForm({ initialValues, onSubmit, onCancel }: BusFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusFormValues>({
    resolver: zodResolver(busSchema),
    defaultValues: toFormValues(initialValues),
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(toBusPayload(values));
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField label="Bus number" error={errors.busNumber} {...register("busNumber")} />
      <TextField label="Type (e.g. AC Sleeper)" error={errors.type} {...register("type")} />
      <TextField label="Capacity" type="number" error={errors.capacity} {...register("capacity")} />
      <SelectField label="Ownership" error={errors.ownership} {...register("ownership")}>
        <option value="OWNED">Owned</option>
        <option value="LEASED">Leased</option>
        <option value="CONTRACTED">Contracted</option>
      </SelectField>
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Insurance expiry" type="date" {...register("insuranceExpiry")} />
        <TextField label="Fitness expiry" type="date" {...register("fitnessExpiry")} />
        <TextField label="Permit expiry" type="date" {...register("permitExpiry")} />
        <TextField label="PUC expiry" type="date" {...register("pucExpiry")} />
      </div>
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
