// 📁 파일 경로: app/(admin)/content/activities/page.tsx

import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";

export default function ActivitiesManagementPage() {
  return (
    <div>
      <PageHeader
        title="활동 게시물 관리"
        description="활동 게시물을 작성하고 관리합니다."
      />
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center text-[var(--color-text-secondary)]">
          <FileText className="mx-auto h-12 w-12 opacity-50" />
          <p className="mt-4">활동 게시물 관리 기능이 준비 중입니다.</p>
        </div>
      </div>
    </div>
  );
}
