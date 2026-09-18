export type BusOwnership = "OWNED" | "LEASED" | "CONTRACTED";

export interface Bus {
  id: string;
  busNumber: string;
  type: string;
  capacity: number;
  ownership: BusOwnership;
  insuranceExpiry: string | null;
  fitnessExpiry: string | null;
  permitExpiry: string | null;
  pucExpiry: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface BusRef {
  id: string;
  busNumber: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string | null;
  licenseNumber: string | null;
  licenseExpiry: string | null;
  salaryRate: string | null;
  allowanceRate: string | null;
  assignedBusId: string | null;
  assignedBus: BusRef | null;
  isActive: boolean;
  createdAt: string;
}

export interface Conductor {
  id: string;
  name: string;
  phone: string | null;
  allowanceRate: string | null;
  assignedBusId: string | null;
  assignedBus: BusRef | null;
  isActive: boolean;
  createdAt: string;
}

export interface BusRoute {
  id: string;
  source: string;
  destination: string;
  distanceKm: string;
  expectedFare: string | null;
  expectedDurationMin: number | null;
  isActive: boolean;
  createdAt: string;
}
