// 📁 파일 경로: app/(public)/about/page.tsx

import { Heart, Globe, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";

const VALUES = [
  {
    icon: Heart,
    title: "평화",
    description: "그리스도의 평화를 세상에 전하며, 비폭력과 화해의 길을 추구합니다.",
  },
  {
    icon: Globe,
    title: "국제연대",
    description: "전 세계 50개국 팍스 크리스티 회원들과 연대하여 평화를 위해 활동합니다.",
  },
  {
    icon: BookOpen,
    title: "평화교육",
    description: "평화의 문화를 확산하기 위한 교육과 연구 활동을 수행합니다.",
  },
  {
    icon: Users,
    title: "공동체",
    description: "기도와 나눔을 통해 평화의 공동체를 형성하고 성장합니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="단체 소개"
        description="팍스 크리스티 코리아는 가톨릭 국제 평화운동 한국 지부입니다."
      />

      {/* 설립 배경 */}
      <section className="mb-16">
        <h2 className="mb-4 font-serif text-2xl font-bold text-[var(--color-text-primary)]">
          설립 배경
        </h2>
        <div className="rounded-lg bg-[var(--color-surface)] p-6 leading-relaxed text-[var(--color-text-secondary)]">
          <p className="mb-4">
            팍스 크리스티(Pax Christi)는 1945년 제2차 세계대전 직후 프랑스에서 시작된
            가톨릭 국제 평화운동입니다. &ldquo;그리스도의 평화&rdquo;라는 뜻을 가진
            이 운동은 전쟁과 폭력의 상처를 치유하고, 정의와 화해를 통한 진정한 평화를
            추구합니다.
          </p>
          <p>
            팍스 크리스티 코리아는 한국 가톨릭 교회와 함께 한반도와 동아시아의
            평화를 위해 기도하고 행동하는 단체로, 국제 팍스 크리스티의 한국 지부로서
            활동하고 있습니다.
          </p>
        </div>
      </section>

      {/* 비전 */}
      <section className="mb-16">
        <h2 className="mb-4 font-serif text-2xl font-bold text-[var(--color-text-primary)]">
          비전
        </h2>
        <div className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-8 text-center">
          <p className="font-serif text-xl text-[var(--color-text-primary)]">
            &ldquo;정의와 평화가 입맞추는 세상&rdquo;
          </p>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            — 시편 85:11
          </p>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="mb-16">
        <h2 className="mb-6 font-serif text-2xl font-bold text-[var(--color-text-primary)]">
          핵심 가치
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <Card key={value.title} className="text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <value.icon className="h-7 w-7 text-[var(--color-primary)]" />
                </div>
                <h3 className="mb-2 font-semibold text-[var(--color-text-primary)]">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
