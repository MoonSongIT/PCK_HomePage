// 📁 파일 경로: app/(public)/about/international/page.tsx

import PageHeader from "@/components/common/PageHeader";
import { Globe } from "lucide-react";

export default function InternationalPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="국제 팍스 크리스티"
        description="전 세계 50개국 이상에서 활동하는 가톨릭 국제 평화운동"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-[var(--color-text-secondary)]">
          <p>
            팍스 크리스티 인터내셔널(Pax Christi International)은 1945년 프랑스에서
            설립된 이래 전 세계 50개국 이상에서 활동하는 가톨릭 평화운동 네트워크입니다.
          </p>
          <p>
            유엔 경제사회이사회(ECOSOC) 협의 지위를 보유하고 있으며,
            비폭력, 인권, 군축, 정의로운 세계 질서를 위해 활동합니다.
          </p>
          <p>
            본부는 벨기에 브뤼셀에 위치해 있으며, 각국 지부와 함께
            지역 및 국제적 차원에서 평화 구축 활동을 전개합니다.
          </p>

          <h3 className="mt-6 font-semibold text-[var(--color-text-primary)]">
            주요 활동 분야
          </h3>
          <ul className="list-inside list-disc space-y-2">
            <li>비폭력과 비폭력 저항</li>
            <li>인권과 인간 존엄성</li>
            <li>군축과 안보</li>
            <li>정의로운 세계 질서</li>
            <li>종교 간 대화</li>
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex h-64 w-full items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
            <Globe className="h-24 w-24 text-[var(--color-primary)]/30" />
            <p className="ml-4 text-[var(--color-text-secondary)]">
              세계 지도 시각화<br />(50개국 활동 표시)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
