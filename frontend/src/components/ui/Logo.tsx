import { Bus } from "lucide-react";

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-900/20">
        <Bus size={18} strokeWidth={2.25} />
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-tight text-white">TripLedger</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-indigo-300">
            Fleet Finance
          </div>
        </div>
      )}
    </div>
  );
}
