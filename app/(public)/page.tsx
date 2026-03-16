// 📁 파일 경로: app/(public)/page.tsx
// 메인 홈 — Hero + 활동 요약 + 교황 메시지 + 숫자로 보는 PCK + 후원 CTA

import HeroSection from "@/components/home/HeroSection";
import ActivityHighlights from "@/components/home/ActivityHighlights";
import PeaceMessage from "@/components/home/PeaceMessage";
import DonationCTA from "@/components/home/DonationCTA";
import { db } from "@/lib/db";
import type { Activity } from "@/types";

// 숫자로 보는 PCK (정적 데이터 — 추후 DB 연동 가능)
function StatsSection() {
  const stats = [
    { label: "회원 수", value: "500+" },
    { label: "활동 연수", value: "30+" },
    { label: "참여 국가", value: "50+" },
    { label: "평화 활동", value: "200+" },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-[var(--color-text-primary)] md:text-3xl">
          숫자로 보는 PCK
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-[var(--color-primary)] md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function getRecentActivities(): Promise<Activity[]> {
  try {
    const activities = await db.activity.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return activities as unknown as Activity[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const activities = await getRecentActivities();

  return (
    <>
      <HeroSection />
      {activities.length > 0 && (
        <ActivityHighlights activities={activities} />
      )}
      <PeaceMessage />
      <StatsSection />
      <DonationCTA />
    </>
  );
}
