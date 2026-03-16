// 📁 파일 경로: components/layout/MobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Heart, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ITEMS = [
  { label: "홈", href: "/", icon: Home },
  { label: "활동", href: "/activities", icon: BookOpen },
  { label: "후원", href: "/donation", icon: Heart },
  { label: "공지", href: "/board/notice", icon: Bell },
  { label: "마이", href: "/mypage", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden">
      <div className="flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs",
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)]"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
