"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardTrendPoint } from "@/types/dashboard";

export function ProfitTrendChart({ data }: { data: DashboardTrendPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-400 shadow-sm">
        No trips in this period yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">Income vs. Expense</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#4f46e5" strokeWidth={2} fill="url(#incomeFill)" />
            <Area type="monotone" dataKey="expense" name="Expense" stroke="#f59e0b" strokeWidth={2} fill="url(#expenseFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
