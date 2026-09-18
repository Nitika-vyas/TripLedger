export type TenantRole = "COMPANY_ADMIN" | "MANAGER" | "DATA_ENTRY";

export interface TenantUserRow {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: TenantRole;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserResult {
  user: { id: string; fullName: string; email: string; role: TenantRole; isActive: boolean };
  temporaryPassword?: string;
}
