import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CreateUserResult, TenantUserRow } from "@/types/user";
import type { toCreateUserPayload, toEditUserPayload } from "@/schemas/user.schema";

const BASE = "/users";

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get<TenantUserRow[]>(BASE),
    enabled,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReturnType<typeof toCreateUserPayload>) => apiClient.post<CreateUserResult>(BASE, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReturnType<typeof toEditUserPayload> }) =>
      apiClient.patch<TenantUserRow>(`${BASE}/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`${BASE}/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
