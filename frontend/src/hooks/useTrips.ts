import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Trip, TripStatus } from "@/types/trip";
import type { toTripPayload } from "@/schemas/trip.schema";

type TripPayload = ReturnType<typeof toTripPayload>;

export interface TripFilters {
  dateFrom?: string;
  dateTo?: string;
  busId?: string;
  routeId?: string;
  driverId?: string;
  status?: TripStatus | "";
}

function toQueryString(filters?: TripFilters) {
  if (!filters) return "";
  const usp = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) usp.set(key, value);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export function useTrips(filters?: TripFilters) {
  return useQuery({
    queryKey: ["trips", filters],
    queryFn: () => apiClient.get<Trip[]>(`/trips${toQueryString(filters)}`),
  });
}

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TripPayload) => apiClient.post<Trip>("/trips", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function useUpdateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TripPayload> }) =>
      apiClient.patch<Trip>(`/trips/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function useDeleteTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/trips/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
}
