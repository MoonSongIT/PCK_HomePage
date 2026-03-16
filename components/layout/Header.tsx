// 📁 파일 경로: components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAIN_NAV_ITEMS } from "@/types";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isAdmin = session?.user?.role
    ? ["SUPER_ADMIN", "ADMIN", "FINANCE"].includes(
        session.user.role as UserRole
      )
    : false;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-surface)]/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-[var(--color-primary)]">
            PAX CHRISTI
          </span>
          <span className="hidden text-sm text-[var(--color-text-secondary)] sm:block">
            KOREA
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden items-center gap-1 lg:flex">
          {MAIN_NAV_ITEMS.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() =>
                item.children && setOpenDropdown(item.href)
              }
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]"
                )}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3 w-3" />}
              </Link>

              {item.children && openDropdown === item.href && (
                <div className="absolute left-0 top-full z-50 min-w-[180px] rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 우측 버튼 */}
        <div className="flex items-center gap-2">
          {session?.user ? (
            <div className="hidden items-center gap-2 lg:flex">
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/dashboard">관리자</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/mypage">
                  <User className="mr-1 h-4 w-4" />
                  {session.user.name || "마이페이지"}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">회원가입</Link>
              </Button>
            </div>
          )}

          {/* 모바일 메뉴 토글 */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {MAIN_NAV_ITEMS.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-background)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block rounded-md px-6 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="border-t border-[var(--color-border)] pt-3">
              {session?.user ? (
                <>
                  <Link
                    href="/mypage"
                    className="block rounded-md px-3 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    마이페이지
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="block rounded-md px-3 py-2 text-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      관리자
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-[var(--color-danger)]"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-md px-3 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-md px-3 py-2 text-sm text-[var(--color-primary)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
