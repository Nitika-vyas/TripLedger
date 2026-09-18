export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  contactPhone: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { users: number; buses: number; trips: number };
}

export interface TenantUser {
  id: string;
  fullName: string;
  email: string;
  role: "COMPANY_ADMIN" | "MANAGER" | "DATA_ENTRY";
  isActive: boolean;
  createdAt: string;
}

export interface TenantDetail {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  contactPhone: string | null;
  isActive: boolean;
  createdAt: string;
  users: TenantUser[];
  _count: { buses: number; drivers: number; conductors: number; routes: number; trips: number };
}

export interface CreateTenantResult {
  tenant: TenantSummary;
  admin: { id: string; email: string; fullName: string };
  temporaryPassword?: string;
}
