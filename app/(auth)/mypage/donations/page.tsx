// 📁 파일 경로: app/(auth)/mypage/donations/page.tsx
"use client";

import { useSession } from "next-auth/react";
import PageHeader from "@/components/common/PageHeader";
import { Heart } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MyDonationsPage() {
  const { data: session } = useSession();

  return (
    <>
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="내 후원 내역"
          description="나의 후원 기록을 확인합니다."
        />

        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
          <Heart className="h-12 w-12 text-[var(--color-text-secondary)] opacity-50" />
          <p className="text-[var(--color-text-secondary)]">
            후원 내역이 없습니다.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
