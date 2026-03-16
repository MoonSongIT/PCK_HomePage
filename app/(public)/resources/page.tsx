// 📁 파일 경로: app/(public)/resources/page.tsx

import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="평화 자료실"
        description="평화와 관련된 자료를 공유합니다."
      />

      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center text-[var(--color-text-secondary)]">
          <FileText className="mx-auto h-12 w-12 opacity-50" />
          <p className="mt-4">자료가 준비 중입니다.</p>
        </div>
      </div>
    </div>
  );
}
