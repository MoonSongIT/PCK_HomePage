// 📁 파일 경로: server/actions/auth.actions.ts
"use server";

import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations/auth.schema";
import type { ApiResponse } from "@/types";

/**
 * 이메일/비밀번호로 회원가입한다.
 */
export async function registerUser(
  formData: unknown
): Promise<ApiResponse<{ id: string }>> {
  try {
    const parsed = registerSchema.parse(formData);

    const existing = await db.user.findUnique({
      where: { email: parsed.email },
    });
    if (existing) {
      return { success: false, error: "이미 가입된 이메일입니다." };
    }

    const hashedPassword = await hash(parsed.password, 12);

    const user = await db.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashedPassword,
        role: "MEMBER",
      },
    });

    return { success: true, data: { id: user.id } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
    };
  }
}

/**
 * 이메일/비밀번호로 로그인한다.
 */
export async function loginUser(
  formData: unknown
): Promise<ApiResponse> {
  try {
    const parsed = loginSchema.parse(formData);

    await signIn("credentials", {
      email: parsed.email,
      password: parsed.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "이메일 또는 비밀번호가 올바르지 않습니다.",
    };
  }
}
