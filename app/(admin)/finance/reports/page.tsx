// 📁 파일 경로: app/(admin)/finance/reports/page.tsx

import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="보고서 생성"
        description="기간별 감사 보고서를 생성하고 관리합니다."
      />

      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <FileText className="h-12 w-12 text-[var(--color-text-secondary)] opacity-50" />
        <p className="text-[var(--color-text-secondary)]">
          보고서 생성 기능이 준비 중입니다.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          @react-pdf/renderer를 사용한 PDF 보고서 생성이 구현될 예정입니다.
        </p>
      </div>
    </div>
  );
}
