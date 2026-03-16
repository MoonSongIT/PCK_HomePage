// 📁 파일 경로: prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // SUPER_ADMIN 사용자 생성
  const adminPassword = await hash("admin1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@paxchristikorea.org" },
    update: {},
    create: {
      email: "admin@paxchristikorea.org",
      name: "관리자",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });

  // 일반 회원 생성
  const memberPassword = await hash("member1234", 12);
  await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      email: "member@example.com",
      name: "회원",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
