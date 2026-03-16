// 📁 파일 경로: app/api/admin/users/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { UserRole } from "@/types";

export async function GET(request: Request) {
  const session = await auth();
  if (
    !session?.user ||
    !["SUPER_ADMIN", "ADMIN"].includes(session.user.role as UserRole)
  ) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      }
    : {};

  const users = await db.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLoginAt: true,
      _count: { select: { donations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}
