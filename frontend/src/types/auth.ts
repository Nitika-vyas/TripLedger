export type TenantRole = "COMPANY_ADMIN" | "MANAGER" | "DATA_ENTRY";
export type GlobalRole = "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: TenantRole | null;
  globalRole: GlobalRole | null;
  tenantId: string | null;
  tenant?: { id: string; name: string; slug: string } | null;
}
