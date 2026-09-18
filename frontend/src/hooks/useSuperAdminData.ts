import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AdminBus, AdminConductor, AdminDriver, AdminRoute, AdminTrip } from "@/types/super-admin-data";

const BASE = "/super-admin";

function toQueryString(tenantId?: string) {
  return tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
}

export function useAllBuses(tenantId?: string) {
  return useQuery({
    queryKey: ["super-admin", "buses", tenantId],
    queryFn: () => apiClient.get<AdminBus[]>(`${BASE}/buses${toQueryString(tenantId)}`),
  });
}

export function useAllDrivers(tenantId?: string) {
  return useQuery({
    queryKey: ["super-admin", "drivers", tenantId],
    queryFn: () => apiClient.get<AdminDriver[]>(`${BASE}/drivers${toQueryString(tenantId)}`),
  });
}

export function useAllConductors(tenantId?: string) {
  return useQuery({
    queryKey: ["super-admin", "conductors", tenantId],
    queryFn: () => apiClient.get<AdminConductor[]>(`${BASE}/conductors${toQueryString(tenantId)}`),
  });
}

export function useAllRoutes(tenantId?: string) {
  return useQuery({
    queryKey: ["super-admin", "routes", tenantId],
    queryFn: () => apiClient.get<AdminRoute[]>(`${BASE}/routes${toQueryString(tenantId)}`),
  });
}

export function useAllTrips(tenantId?: string) {
  return useQuery({
    queryKey: ["super-admin", "trips", tenantId],
    queryFn: () => apiClient.get<AdminTrip[]>(`${BASE}/trips${toQueryString(tenantId)}`),
  });
}
