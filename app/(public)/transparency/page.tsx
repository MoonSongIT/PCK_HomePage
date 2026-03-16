// 📁 파일 경로: app/(public)/transparency/page.tsx
// 후원금 투명성 공개 페이지 — 로그인 없이 누구나 열람 가능

import { Suspense } from "react";
import { TrendingUp, TrendingDown, Wallet, Users } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import FinanceSummaryCard from "@/components/finance/FinanceSummaryCard";
import DonationChart from "@/components/finance/DonationChart";
import ExpenseChart from "@/components/finance/ExpenseChart";
import TransparencyTable from "@/components/finance/TransparencyTable";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getTransparencyData } from "@/server/actions/finance.actions";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";
import { Download } from "lucide-react";

interface Props {
  searchParams: Promise<{ year?: string }>;
}

export default async function TransparencyPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const year = params.year ? parseInt(params.year) : currentYear;

  const result = await getTransparencyData(year);

  // 감사 보고서 조회
  const reports = await db.financeReport
    .findMany({
      where: { year, isPublished: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  const data = result.data;

  // 연도 탭 (최근 5년)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="후원금 투명성 공개"
        description="팍스 크리스티 코리아의 재정 현황을 투명하게 공개합니다."
      />

      {/* 연도 탭 */}
      <div className="mb-8 flex flex-wrap gap-2">
        {years.map((y) => (
          <Link key={y} href={`/transparency?year=${y}`}>
            <Button
              variant={y === year ? "default" : "outline"}
              size="sm"
            >
              {y}년
            </Button>
          </Link>
        ))}
      </div>

      {!data ? (
        <div className="py-16 text-center text-[var(--color-text-secondary)]">
          {year}년 재정 데이터가 없습니다.
        </div>
      ) : (
        <>
          {/* 요약 카드 4개 */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FinanceSummaryCard
              title="총 후원금 수입"
              value={data.summary.totalIncome}
              icon={TrendingUp}
              colorClass="text-[var(--color-primary)]"
            />
            <FinanceSummaryCard
              title="총 지출"
              value={data.summary.totalExpense}
              icon={TrendingDown}
              colorClass="text-[var(--color-accent)]"
            />
            <FinanceSummaryCard
              title="잔액"
              value={data.summary.balance}
              icon={Wallet}
              colorClass="text-[var(--color-secondary)]"
            />
            <FinanceSummaryCard
              title="후원자 수"
              value={data.summary.donorCount}
              icon={Users}
              format="number"
              colorClass="text-[var(--color-primary)]"
            />
          </div>

          {/* 차트 */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Suspense fallback={<LoadingSpinner />}>
              <DonationChart
                data={data.monthlyData}
                title={`${year}년 월별 수입·지출 현황`}
              />
            </Suspense>
            <Suspense fallback={<LoadingSpinner />}>
              <ExpenseChart
                data={data.expenseByCategory}
                title={`${year}년 항목별 지출 비율`}
              />
            </Suspense>
          </div>

          {/* 상세 내역 테이블 */}
          <div className="mb-8">
            <TransparencyTable
              donations={data.publicDonations}
              expenses={data.publicExpenses}
            />
          </div>

          {/* 감사 보고서 다운로드 */}
          {reports.length > 0 && (
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
                감사 보고서 다운로드
              </h3>
              <div className="space-y-2">
                {reports.map((report) => (
                  <a
                    key={report.id}
                    href={report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-background)]"
                  >
                    <Download className="h-4 w-4" />
                    {report.period} 감사 보고서
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
