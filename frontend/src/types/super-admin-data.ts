import type { Bus, Conductor, Driver, BusRoute } from "./master-data";

export interface TenantRef {
  id: string;
  name: string;
  slug: string;
}

export type AdminBus = Bus & { tenant: TenantRef };
export type AdminDriver = Driver & { tenant: TenantRef };
export type AdminConductor = Conductor & { tenant: TenantRef };
export type AdminRoute = BusRoute & { tenant: TenantRef };

export interface AdminTrip {
  id: string;
  tripDate: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  distanceKm: string | null;
  passengerCount: number | null;
  parcelCount: number | null;
  tenant: TenantRef;
  bus: { id: string; busNumber: string };
  route: { id: string; source: string; destination: string };
  driver: { id: string; name: string } | null;
  conductor: { id: string; name: string } | null;
}
