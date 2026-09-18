"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Bus as BusIcon,
  UserRound,
  Ticket,
  Map,
  Route as RouteIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { href: "/super-admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/super-admin/tenants", label: "Tenants", icon: Building2 },
  { href: "/super-admin/trips", label: "Trips", icon: RouteIcon },
  { href: "/super-admin/buses", label: "Buses", icon: BusIcon },
  { href: "/super-admin/drivers", label: "Drivers", icon: UserRound },
  { href: "/super-admin/conductors", label: "Conductors", icon: Ticket },
  { href: "/super-admin/routes", label: "Routes", icon: Map },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 md:flex">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Logo />
      </div>
      <div className="mx-3 mt-3 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-violet-300">
        Platform Admin
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-600/15 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-violet-500" />
              )}
              <Icon
                size={18}
                strokeWidth={2}
                className={active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
