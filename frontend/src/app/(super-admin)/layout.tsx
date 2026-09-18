"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/Avatar";
import { SuperAdminSidebar } from "@/components/layout/SuperAdminSidebar";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return router.replace("/login");
    if (user.globalRole !== "SUPER_ADMIN") router.replace("/dashboard");
  }, [isLoading, user, router]);

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (isLoading || !user || user.globalRole !== "SUPER_ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SuperAdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            Platform-wide administration
          </span>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium leading-tight text-gray-900">{user.fullName}</div>
              <div className="text-xs leading-tight text-gray-500">Super Admin</div>
            </div>
            <Avatar name={user.fullName} tone="violet" />
            <button
              onClick={onLogout}
              title="Log out"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={16} strokeWidth={2} />
            </button>
          </div>
        </header>
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
