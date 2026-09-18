"use client";

import { useState } from "react";
import { Route as RouteIcon, IndianRupee, Receipt, TrendingUp } from "lucide-react";
import { useDashboardSummary, DashboardRange } from "@/hooks/useDashboard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ProfitTrendChart } from "@/components/dashboard/ProfitTrendChart";
import { TopList } from "@/components/dashboard/TopList";
import { DateRangePicker } from "@/components/ui/DateRangePicker";

const money = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function DashboardPage() {
  const [range, setRange] = useState<DashboardRange>({});
  const { data, isLoading } = useDashboardSummary(range);
  const totals = data?.totals;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">A live snapshot of your fleet&apos;s trips and profitability.</p>
      </div>

      <DateRangePicker value={range} onChange={setRange} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Trips" value={isLoading ? "—" : String(totals?.totalTrips ?? 0)} icon={RouteIcon} />
        <KpiCard label="Total Income" value={isLoading ? "—" : money(totals?.totalIncome ?? 0)} icon={IndianRupee} />
        <KpiCard label="Total Expense" value={isLoading ? "—" : money(totals?.totalExpense ?? 0)} icon={Receipt} />
        <KpiCard
          label="Net Profit"
          value={isLoading ? "—" : money(totals?.netProfit ?? 0)}
          tone={totals && totals.netProfit < 0 ? "negative" : "positive"}
          icon={TrendingUp}
        />
      </div>

      <ProfitTrendChart data={data?.trend ?? []} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopList
          title="Top Routes by Profit"
          items={(data?.topRoutes ?? []).map((r) => ({
            label: `${r.source} → ${r.destination}`,
            trips: r.trips,
            profit: r.profit,
          }))}
        />
        <TopList
          title="Top Buses by Profit"
          items={(data?.topBuses ?? []).map((b) => ({ label: b.busNumber, trips: b.trips, profit: b.profit }))}
        />
      </div>
    </div>
  );
}
