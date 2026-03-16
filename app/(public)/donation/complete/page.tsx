// 📁 파일 경로: app/(public)/donation/complete/page.tsx

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DonationCompletePage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-[var(--color-success)]" />
        <h1 className="mt-4 font-serif text-2xl font-bold text-[var(--color-text-primary)]">
          후원이 완료되었습니다
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          소중한 후원에 감사드립니다. 여러분의 후원이 평화의 씨앗이 됩니다.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">홈으로</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/transparency">투명성 공개</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
