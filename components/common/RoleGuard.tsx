// 📁 파일 경로: components/common/RoleGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
