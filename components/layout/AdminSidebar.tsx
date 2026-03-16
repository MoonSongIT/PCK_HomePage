// 📁 파일 경로: components/layout/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  FileText,
  Settings,
  Key,
  BarChart3,
  CreditCard,
  Receipt,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "대시보드",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "FINANCE"],
  },
  {
    label: "후원금 현황",
    href: "/admin/finance",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "ADMIN", "FINANCE"],
  },
  {
    label: "후원 내역",
    href: "/admin/finance/donations",
    icon: CreditCard,
    roles: ["SUPER_ADMIN", "ADMIN", "FINANCE"],
  },
  {
    label: "지출 내역",
    href: "/admin/finance/expenses",
    icon: Receipt,
    roles: ["SUPER_ADMIN", "ADMIN", "FINANCE"],
  },
  {
    label: "보고서",
    href: "/admin/finance/reports",
    icon: DollarSign,
    roles: ["SUPER_ADMIN", "ADMIN", "FINANCE"],
  },
  {
    label: "회원 관리",
    href: "/admin/users",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    label: "콘텐츠 관리",
    href: "/admin/content/activities",
    icon: FileText,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    label: "API 키 관리",
    href: "/admin/settings/api-keys",
    icon: Key,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "일반 설정",
    href: "/admin/settings/general",
    icon: Settings,
    roles: ["SUPER_ADMIN"],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const filteredItems = SIDEBAR_ITEMS.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--color-primary)]"
        >
          <Home className="h-5 w-5" />
          <span className="font-serif font-bold">PCK 관리자</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-border)] p-4">
        <div className="text-xs text-[var(--color-text-secondary)]">
          <p>{session?.user?.name || session?.user?.email}</p>
          <p className="mt-1 uppercase">{userRole}</p>
        </div>
      </div>
    </aside>
  );
}
