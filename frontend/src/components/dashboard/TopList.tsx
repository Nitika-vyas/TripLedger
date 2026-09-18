import { Trophy } from "lucide-react";

interface TopListItem {
  label: string;
  trips: number;
  profit: number;
}

export function TopList({ title, items }: { title: string; items: TopListItem[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">No data yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-100">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center justify-between gap-3 py-2.5 text-sm first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                    i === 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {i === 0 ? <Trophy size={12} /> : i + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.trips} trip(s)</div>
                </div>
              </div>
              <div className={`font-medium ${item.profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                {item.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
