// 📁 파일 경로: lib/auth.config.ts
// Edge 런타임 호환 NextAuth 설정 (미들웨어 전용)
// Node.js 전용 모듈(bcryptjs, Prisma 등)을 import하지 않음

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { UserRole } from "@/types";

declare module "next-auth" {
  interface User {
    role: UserRole;
    isActive: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: UserRole;
      isActive: boolean;
      image: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: UserRole;
    isActive: boolean;
  }
}

/**
 * Edge 런타임에서 사용 가능한 NextAuth 설정
 * - Prisma adapter, bcryptjs 등 Node.js 전용 모듈 미포함
 * - authorize()는 lib/auth.ts에서 별도 정의
 * - Google provider는 lib/auth.ts에서만 정의 (환경변수 필요)
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    // Credentials provider는 여기서는 껍데기만 정의
    // 실제 authorize 로직은 lib/auth.ts에서 override
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      authorize: () => null,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
      }
      return session;
    },
    // signIn 콜백: user.isActive가 undefined일 수 있으므로 안전하게 처리
    async signIn({ user }) {
      // isActive가 명시적으로 false인 경우만 차단
      if (user.isActive === false) return false;
      return true;
    },
    // authorized 콜백은 사용하지 않음
    // 리다이렉트 로직은 middleware.ts에서 직접 처리
    authorized() {
      // 항상 true 반환하여 NextAuth 자체 리다이렉트 방지
      // 접근 제어는 middleware.ts에서 수동 처리
      return true;
    },
  },
};
