// 📁 파일 경로: middleware.ts
// 라우트 보호 미들웨어 (Edge 런타임 호환)
// Node.js 전용 모듈을 import하지 않도록 auth.config.ts만 사용

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import type { UserRole } from "@/types";

const { auth } = NextAuth(authConfig);

// 경로별 접근 허용 역할 (구체적 경로 우선)
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/admin/settings/api-keys": ["SUPER_ADMIN"],
  "/admin/settings": ["SUPER_ADMIN"],
  "/admin/users": ["SUPER_ADMIN", "ADMIN"],
  "/admin/finance": ["SUPER_ADMIN", "ADMIN", "FINANCE"],
  "/admin": ["SUPER_ADMIN", "ADMIN", "FINANCE"],
  "/mypage": ["SUPER_ADMIN", "ADMIN", "FINANCE", "MEMBER"],
};

// 인증 필요 경로
const AUTH_ROUTES = ["/mypage", "/admin"];

// 인증된 사용자가 접근하면 안 되는 경로
const GUEST_ONLY_ROUTES = ["/login", "/register"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // 인증된 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
  if (user && GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 인증 필요 경로 확인
  const requiresAuth = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (requiresAuth && !user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 역할 기반 접근 제어
  if (user) {
    // 가장 구체적인 경로부터 매칭
    const sortedPaths = Object.keys(ROUTE_PERMISSIONS).sort(
      (a, b) => b.length - a.length
    );

    for (const path of sortedPaths) {
      if (pathname.startsWith(path)) {
        const allowedRoles = ROUTE_PERMISSIONS[path];
        if (!allowedRoles.includes(user.role as UserRole)) {
          if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(
              new URL("/admin/dashboard", req.url)
            );
          }
          return NextResponse.redirect(new URL("/", req.url));
        }
        break;
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/mypage/:path*",
    "/login",
    "/register",
  ],
};
