import { useAuth } from "./auth-context";

/** COMPANY_ADMIN and MANAGER can create/edit/delete master data; DATA_ENTRY is read-only. */
export function useCanManageMasterData() {
  const { user } = useAuth();
  return user?.role === "COMPANY_ADMIN" || user?.role === "MANAGER";
}

/** Recording trips is DATA_ENTRY's job too — all tenant roles can create/edit trips. */
export function useCanEditTrips() {
  const { user } = useAuth();
  return user?.role === "COMPANY_ADMIN" || user?.role === "MANAGER" || user?.role === "DATA_ENTRY";
}

/** Deleting a financial record stays admin/manager-only. */
export function useCanDeleteTrips() {
  return useCanManageMasterData();
}
