// 📁 파일 경로: app/(public)/about/members/page.tsx

import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

// 임원 프로필 (실제 데이터는 DB 연동 필요)
const MEMBERS = [
  { name: "대표", title: "대표", description: "팍스 크리스티 코리아 대표" },
  { name: "부대표", title: "부대표", description: "국제 연대 담당" },
  { name: "사무국장", title: "사무국장", description: "운영 총괄" },
  { name: "평화교육 위원장", title: "위원장", description: "평화교육 프로그램 기획" },
];

export default function MembersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="임원 소개"
        description="팍스 크리스티 코리아의 임원진을 소개합니다."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MEMBERS.map((member) => (
          <Card key={member.name} className="text-center">
            <CardContent className="p-6">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-background)]">
                <User className="h-10 w-10 text-[var(--color-text-secondary)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                {member.name}
              </h3>
              <p className="text-sm text-[var(--color-primary)]">
                {member.title}
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {member.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
