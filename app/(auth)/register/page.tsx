// 📁 파일 경로: app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth.schema";
import { registerUser } from "@/server/actions/auth.actions";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registerSchema) as any,
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError("");

    const result = await registerUser(data);

    setLoading(false);

    if (!result.success) {
      setError(result.error || "회원가입에 실패했습니다.");
    } else {
      router.push("/login");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/">
          <span className="font-serif text-2xl font-bold text-[var(--color-primary)]">
            PAX CHRISTI KOREA
          </span>
        </Link>
        <CardTitle className="mt-4 text-xl">회원가입</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-[var(--color-danger)]/10 p-3 text-sm text-[var(--color-danger)]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              placeholder="이름을 입력하세요"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-[var(--color-danger)]">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-[var(--color-danger)]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="8자 이상, 영문+숫자"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-[var(--color-danger)]">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-[var(--color-danger)]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="text-[var(--color-primary)] hover:underline"
          >
            로그인
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
