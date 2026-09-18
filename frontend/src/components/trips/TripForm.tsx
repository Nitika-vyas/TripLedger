"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tripSchema,
  tripDefaultValues,
  toTripPayload,
  TripFormValues,
  EXPENSE_CATEGORIES,
} from "@/schemas/trip.schema";
import { useBuses } from "@/hooks/useBuses";
import { useRoutes } from "@/hooks/useRoutes";
import { useDrivers } from "@/hooks/useDrivers";
import { useConductors } from "@/hooks/useConductors";
import { Trash2 } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";
import { ReceiptUpload } from "@/components/trips/ReceiptUpload";
import type { Trip } from "@/types/trip";

interface TripFormProps {
  initialValues?: Trip;
  onSubmit: (payload: ReturnType<typeof toTripPayload>) => Promise<void>;
  onCancel: () => void;
}

const CATEGORY_LABELS: Record<(typeof EXPENSE_CATEGORIES)[number], string> = {
  FUEL: "Fuel",
  TOLL: "Toll",
  PARKING: "Parking",
  FOOD: "Food",
  DRIVER_ALLOWANCE: "Driver Allowance",
  REPAIRS: "Repairs",
  OTHER: "Other",
};

function toFormValues(trip?: Trip): TripFormValues {
  if (!trip) return tripDefaultValues;
  return {
    tripDate: trip.tripDate.slice(0, 10),
    busId: trip.busId,
    routeId: trip.routeId,
    driverId: trip.driverId ?? "",
    conductorId: trip.conductorId ?? "",
    distanceKm: trip.distanceKm ?? "",
    passengerCount: trip.passengerCount !== null ? String(trip.passengerCount) : "",
    parcelCount: trip.parcelCount !== null ? String(trip.parcelCount) : "",
    status: trip.status,
    notes: trip.notes ?? "",
    ticketSales: trip.income?.ticketSales ?? "",
    otherIncome: trip.income?.otherIncome ?? "",
    incomeNotes: trip.income?.notes ?? "",
    expenses: trip.expenses.map((e) => ({
      category: e.category,
      amount: e.amount,
      notes: e.notes ?? "",
      receiptUrl: e.receiptUrl ?? undefined,
    })),
  };
}

export function TripForm({ initialValues, onSubmit, onCancel }: TripFormProps) {
  const { data: buses } = useBuses({ isActive: true });
  const { data: routes } = useRoutes({ isActive: true });
  const { data: drivers } = useDrivers({ isActive: true });
  const { data: conductors } = useConductors({ isActive: true });

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: toFormValues(initialValues),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "expenses" });

  const submit = handleSubmit(async (values) => {
    await onSubmit(toTripPayload(values));
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Trip date" type="date" error={errors.tripDate} {...register("tripDate")} />
        <SelectField label="Status" error={errors.status} {...register("status")}>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </SelectField>
        <SelectField label="Bus" error={errors.busId} {...register("busId")}>
          <option value="">— Select bus —</option>
          {buses?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.busNumber}
            </option>
          ))}
        </SelectField>
        <SelectField label="Route" error={errors.routeId} {...register("routeId")}>
          <option value="">— Select route —</option>
          {routes?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.source} → {r.destination}
            </option>
          ))}
        </SelectField>
        <SelectField label="Driver" {...register("driverId")}>
          <option value="">— Unassigned —</option>
          {drivers?.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </SelectField>
        <SelectField label="Conductor" {...register("conductorId")}>
          <option value="">— Unassigned —</option>
          {conductors?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <TextField label="Distance (km)" type="number" step="0.01" {...register("distanceKm")} />
        <TextField
          label="No. of passengers"
          type="number"
          min="0"
          error={errors.passengerCount}
          {...register("passengerCount")}
        />
        <TextField
          label="No. of parcels"
          type="number"
          min="0"
          error={errors.parcelCount}
          {...register("parcelCount")}
        />
      </div>
      <TextField label="Notes" {...register("notes")} />

      <div className="rounded-md border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Income</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Ticket sales" type="number" step="0.01" {...register("ticketSales")} />
          <TextField label="Other income" type="number" step="0.01" {...register("otherIncome")} />
        </div>
        <div className="mt-4">
          <TextField label="Income notes" {...register("incomeNotes")} />
        </div>
      </div>

      <div className="rounded-md border border-gray-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Expenses</h3>
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ category: "FUEL", amount: "", notes: "", receiptUrl: undefined })}
          >
            + Add Expense
          </Button>
        </div>
        {fields.length === 0 && <p className="text-sm text-gray-400">No expenses added yet.</p>}
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-start gap-2">
                <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
                  <SelectField label="Category" {...register(`expenses.${index}.category`)}>
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </SelectField>
                  <TextField
                    label="Amount"
                    type="number"
                    step="0.01"
                    error={errors.expenses?.[index]?.amount}
                    {...register(`expenses.${index}.amount`)}
                  />
                  <TextField label="Notes" {...register(`expenses.${index}.notes`)} />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="Remove expense"
                  title="Remove expense"
                  className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-2">
                <span className="mb-1 block text-xs font-medium text-gray-500">Receipt</span>
                <ReceiptUpload
                  value={watch(`expenses.${index}.receiptUrl`)}
                  onChange={(url) => setValue(`expenses.${index}.receiptUrl`, url)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save Trip
        </Button>
      </div>
    </form>
  );
}
