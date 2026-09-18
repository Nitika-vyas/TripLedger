import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CreateTenantResult, TenantDetail, TenantSummary } from "@/types/tenant";
import type { toCreateTenantPayload } from "@/schemas/tenant.schema";

const BASE = "/super-admin/tenants";

export function useTenants() {
  return useQuery({
    queryKey: ["super-admin", "tenants"],
    queryFn: () => apiClient.get<TenantSummary[]>(BASE),
  });
}

export function useTenant(id: string | undefined) {
  return useQuery({
    queryKey: ["super-admin", "tenants", id],
    queryFn: () => apiClient.get<TenantDetail>(`${BASE}/${id}`),
    enabled: !!id,
  });
}

export function useCreateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReturnType<typeof toCreateTenantPayload>) =>
      apiClient.post<CreateTenantResult>(BASE, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["super-admin", "tenants"] }),
  });
}

export function useUpdateTenantStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch<TenantSummary>(`${BASE}/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["super-admin", "tenants"] }),
  });
}
