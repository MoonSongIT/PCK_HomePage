// 📁 파일 경로: lib/auth.ts
// NextAuth v5 설정 + RBAC

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { db } from "./db";
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

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;
        if (!user.isActive) return null;

        const isValid = await compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        // 최종 로그인 시간 갱신
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          isActive: user.isActive,
          image: user.image,
        };
      },
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
    async signIn({ user }) {
      if (!user.isActive) return false;
      return true;
    },
  },
});

// ============================================
// 역할 기반 접근 제어 헬퍼
// ============================================

const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  FINANCE: 3,
  MEMBER: 2,
  GUEST: 1,
};

export function hasMinimumRole(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function hasRole(
  userRole: UserRole,
  allowedRoles: UserRole[]
): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Server Action에서 인증 및 역할 검증을 수행한다.
 * 미들웨어 우회 방어를 위해 Server Action 내에서도 재검증한다.
 */
export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("인증이 필요합니다.");
  }

  if (!session.user.isActive) {
    throw new Error("비활성화된 계정입니다.");
  }

  if (allowedRoles && !hasRole(session.user.role, allowedRoles)) {
    throw new Error("접근 권한이 없습니다.");
  }

  return session.user;
}
