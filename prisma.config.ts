// 📁 파일 경로: prisma.config.ts
// Prisma 7 설정 파일 — datasource URL을 여기서 관리

import path from "node:path";
import { defineConfig } from "prisma/config";

// .env.local 파일 로드 (Prisma 7은 자동 로드하지 않음)
import "dotenv/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
  },
  datasource: {
    // DATABASE_URL이 없으면 더미 값 사용 (prisma generate만 실행 시)
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/pck_placeholder",
  },
});
