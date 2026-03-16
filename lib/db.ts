// 📁 파일 경로: lib/db.ts
// Prisma 7 클라이언트 싱글톤 (adapter 방식)

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // DB URL이 없으면 어댑터 없이 생성 (prisma generate만 필요한 경우)
    console.warn(
      "⚠️ DATABASE_URL이 설정되지 않았습니다. DB 연동 기능이 동작하지 않습니다."
    );
    return new PrismaClient();
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
