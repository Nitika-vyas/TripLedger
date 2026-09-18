"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bus as BusIcon,
  UserRound,
  Ticket,
  Map,
  Route as RouteIcon,
  FileBarChart,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "Trips", icon: RouteIcon },
  { href: "/buses", label: "Buses", icon: BusIcon },
  { href: "/drivers", label: "Drivers", icon: UserRound },
  { href: "/conductors", label: "Conductors", icon: Ticket },
  { href: "/routes", label: "Routes", icon: Map },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/users", label: "Users", icon: Users, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "COMPANY_ADMIN";

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 md:flex">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Operations
        </div>
        {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600/15 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500" />
              )}
              <Icon
                size={18}
                strokeWidth={2}
                className={active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="rounded-lg bg-white/5 px-3 py-2.5 text-xs text-slate-400">
          <span className="font-medium text-slate-300">TripLedger</span> &mdash; Every trip. Every
          rupee. Complete control.
        </div>
      </div>
    </aside>
  );
}
