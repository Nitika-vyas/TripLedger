"use client";

import { useState } from "react";

interface DateRange {
  dateFrom?: string;
  dateTo?: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function presetRange(preset: "today" | "week" | "month" | "year"): DateRange {
  const now = new Date();
  if (preset === "today") return { dateFrom: toISODate(now), dateTo: toISODate(now) };
  if (preset === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    return { dateFrom: toISODate(start), dateTo: toISODate(now) };
  }
  if (preset === "month") {
    return { dateFrom: toISODate(new Date(now.getFullYear(), now.getMonth(), 1)), dateTo: toISODate(now) };
  }
  return { dateFrom: toISODate(new Date(now.getFullYear(), 0, 1)), dateTo: toISODate(now) };
}

const PRESETS: { key: "today" | "week" | "month" | "year"; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "Last 7 days" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

/** Quick-preset buttons + custom From/To date inputs, shared by Dashboard and Reports. */
export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-1.5 rounded-lg bg-gray-100 p-1">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setActivePreset(p.key);
              onChange(presetRange(p.key));
            }}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activePreset === p.key
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">From</label>
        <input
          type="date"
          value={value.dateFrom ?? ""}
          onChange={(e) => {
            setActivePreset(null);
            onChange({ ...value, dateFrom: e.target.value });
          }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">To</label>
        <input
          type="date"
          value={value.dateTo ?? ""}
          onChange={(e) => {
            setActivePreset(null);
            onChange({ ...value, dateTo: e.target.value });
          }}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </div>
    </div>
  );
}
