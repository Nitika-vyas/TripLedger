"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  routeSchema,
  routeDefaultValues,
  toRoutePayload,
  RouteFormValues,
} from "@/schemas/route.schema";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import type { BusRoute } from "@/types/master-data";

interface RouteFormProps {
  initialValues?: BusRoute;
  onSubmit: (payload: ReturnType<typeof toRoutePayload>) => Promise<void>;
  onCancel: () => void;
}

function toFormValues(route?: BusRoute): RouteFormValues {
  if (!route) return routeDefaultValues;
  return {
    source: route.source,
    destination: route.destination,
    distanceKm: route.distanceKm,
    expectedFare: route.expectedFare ?? "",
    expectedDurationMin: route.expectedDurationMin ? String(route.expectedDurationMin) : "",
  };
}

export function RouteForm({ initialValues, onSubmit, onCancel }: RouteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: toFormValues(initialValues),
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(toRoutePayload(values));
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TextField label="Source" error={errors.source} {...register("source")} />
      <TextField label="Destination" error={errors.destination} {...register("destination")} />
      <TextField
        label="Distance (km)"
        type="number"
        step="0.01"
        error={errors.distanceKm}
        {...register("distanceKm")}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Expected fare" type="number" step="0.01" {...register("expectedFare")} />
        <TextField label="Expected duration (min)" type="number" {...register("expectedDurationMin")} />
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
