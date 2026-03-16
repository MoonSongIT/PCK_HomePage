// 📁 파일 경로: app/(admin)/dashboard/page.tsx

import { TrendingUp, TrendingDown, Wallet, UserPlus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import FinanceSummaryCard from "@/components/finance/FinanceSummaryCard";
import DonationChart from "@/components/finance/DonationChart";
import { getFinanceDashboard } from "@/server/actions/finance.actions";

export default async function AdminDashboardPage() {
  const result = await getFinanceDashboard();
  const data = result.data;

  return (
    <div>
      <PageHeader
        title="관리자 대시보드"
        description="팍스 크리스티 코리아 관리 현황"
      />

      {data ? (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FinanceSummaryCard
              title="이번 달 수입"
              value={data.monthlyIncome}
              icon={TrendingUp}
              colorClass="text-[var(--color-primary)]"
            />
            <FinanceSummaryCard
              title="이번 달 지출"
              value={data.monthlyExpense}
              icon={TrendingDown}
              colorClass="text-[var(--color-accent)]"
            />
            <FinanceSummaryCard
              title="누적 잔액"
              value={data.totalBalance}
              icon={Wallet}
              colorClass="text-[var(--color-secondary)]"
            />
            <FinanceSummaryCard
              title="신규 후원자"
              value={data.newDonors}
              icon={UserPlus}
              format="number"
              colorClass="text-[var(--color-primary)]"
            />
          </div>

          <DonationChart
            data={data.monthlyData}
            title="월별 수입·지출 추이"
          />
        </>
      ) : (
        <div className="py-16 text-center text-[var(--color-text-secondary)]">
          대시보드 데이터를 불러올 수 없습니다.
        </div>
      )}
    </div>
  );
}
