export interface DashboardTotals {
  totalTrips: number;
  completedTrips: number;
  scheduledTrips: number;
  cancelledTrips: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export interface DashboardTrendPoint {
  date: string;
  income: number;
  expense: number;
  profit: number;
}

export interface DashboardTopRoute {
  source: string;
  destination: string;
  trips: number;
  income: number;
  expense: number;
  profit: number;
}

export interface DashboardTopBus {
  busNumber: string;
  trips: number;
  income: number;
  expense: number;
  profit: number;
}

export interface DashboardSummary {
  range: { dateFrom: string; dateTo: string };
  totals: DashboardTotals;
  trend: DashboardTrendPoint[];
  topRoutes: DashboardTopRoute[];
  topBuses: DashboardTopBus[];
}
