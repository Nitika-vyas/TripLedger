"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/Avatar";

const ROLE_LABELS: Record<string, string> = {
  COMPANY_ADMIN: "Company Admin",
  MANAGER: "Manager",
  DATA_ENTRY: "Data Entry",
};

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {user?.tenant?.name ?? ""}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <div className="text-sm font-medium leading-tight text-gray-900">{user?.fullName}</div>
          <div className="text-xs leading-tight text-gray-500">
            {ROLE_LABELS[user?.role ?? ""] ?? user?.role ?? user?.globalRole}
          </div>
        </div>
        <Avatar name={user?.fullName ?? "?"} />
        <button
          onClick={onLogout}
          title="Log out"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
