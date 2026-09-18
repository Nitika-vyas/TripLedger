import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DashboardSummary } from "@/types/dashboard";

export interface DashboardRange {
  dateFrom?: string;
  dateTo?: string;
}

function toQueryString(range?: DashboardRange) {
  if (!range) return "";
  const usp = new URLSearchParams();
  if (range.dateFrom) usp.set("dateFrom", range.dateFrom);
  if (range.dateTo) usp.set("dateTo", range.dateTo);
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export function useDashboardSummary(range?: DashboardRange) {
  return useQuery({
    queryKey: ["dashboard", "summary", range],
    queryFn: () => apiClient.get<DashboardSummary>(`/dashboard/summary${toQueryString(range)}`),
  });
}
