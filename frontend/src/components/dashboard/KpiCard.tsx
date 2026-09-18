import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
}

const TONE_TEXT: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  positive: "text-green-700",
  negative: "text-red-600",
  neutral: "text-gray-900",
};

const TONE_ICON: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  positive: "bg-green-50 text-green-600",
  negative: "bg-red-50 text-red-600",
  neutral: "bg-indigo-50 text-indigo-600",
};

export function KpiCard({ label, value, tone = "neutral", icon: Icon }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-gray-500">{label}</div>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONE_ICON[tone]}`}>
            <Icon size={17} strokeWidth={2} />
          </div>
        )}
      </div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${TONE_TEXT[tone]}`}>{value}</div>
    </div>
  );
}
