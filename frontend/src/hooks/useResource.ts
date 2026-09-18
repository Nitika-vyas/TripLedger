import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface ListParams {
  isActive?: boolean;
  search?: string;
}

function toQueryString(params?: ListParams) {
  if (!params) return "";
  const usp = new URLSearchParams();
  if (params.isActive !== undefined) usp.set("isActive", String(params.isActive));
  if (params.search) usp.set("search", params.search);
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Builds a set of React Query hooks for a tenant-scoped master-data REST
 * resource (buses, drivers, conductors, routes) that all share the same
 * list/create/update/delete shape.
 */
export function createResourceHooks<T extends { id: string }, TCreate = Partial<T>, TUpdate = Partial<T>>(
  resourcePath: string,
  queryKey: string
) {
  function useList(params?: ListParams) {
    return useQuery({
      queryKey: [queryKey, params],
      queryFn: () => apiClient.get<T[]>(`${resourcePath}${toQueryString(params)}`),
    });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data: TCreate) => apiClient.post<T>(resourcePath, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  function useUpdate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: TUpdate }) =>
        apiClient.patch<T>(`${resourcePath}/${id}`, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  function useDelete() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => apiClient.delete<void>(`${resourcePath}/${id}`),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  return { useList, useCreate, useUpdate, useDelete };
}
