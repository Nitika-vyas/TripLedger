"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return router.replace("/login");
    router.replace(user.globalRole === "SUPER_ADMIN" ? "/super-admin/overview" : "/dashboard");
  }, [isLoading, user, router]);

  return null;
}
