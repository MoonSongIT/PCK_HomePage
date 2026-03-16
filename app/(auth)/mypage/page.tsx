// 📁 파일 경로: app/(auth)/mypage/page.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { User, Heart, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/common/PageHeader";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MyPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <LoadingSpinner />;

  const user = session?.user;

  return (
    <>
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader title="마이페이지" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                개인 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">이름</span>
                <span>{user?.name || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">이메일</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">역할</span>
                <Badge variant="outline">{user?.role}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5" />
                후원
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href="/mypage/donations">내 후원 내역 보기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
