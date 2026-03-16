// 📁 파일 경로: hooks/useRole.ts
"use client";

import { useSession } from "next-auth/react";
import type { UserRole } from "@/types";

export function useRole() {
  const { data: session, status } = useSession();
  const role = (session?.user?.role as UserRole) || "GUEST";

  return {
    role,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isSuperAdmin: role === "SUPER_ADMIN",
    isAdmin: role === "SUPER_ADMIN" || role === "ADMIN",
    isFinance:
      role === "SUPER_ADMIN" || role === "ADMIN" || role === "FINANCE",
    isMember: role !== "GUEST",
    user: session?.user,
  };
}
