// 📁 파일 경로: app/(admin)/finance/donations/page.tsx
"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useDonations } from "@/hooks/useDonations";
import { toggleDonationPublic } from "@/server/actions/donation.actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "success" | "destructive" | "outline" }> = {
  PENDING: { label: "대기", variant: "outline" },
  COMPLETED: { label: "완료", variant: "success" },
  CANCELLED: { label: "취소", variant: "destructive" },
  REFUNDED: { label: "환불", variant: "destructive" },
};

export default function DonationsManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: result, isLoading, refetch } = useDonations({
    page,
    pageSize: 20,
    donorName: search || undefined,
  });

  const data = result?.data;

  const handleTogglePublic = async (id: string) => {
    await toggleDonationPublic(id);
    refetch();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="후원 내역 관리"
        description="후원 내역을 조회하고 관리합니다."
      >
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          엑셀 다운로드
        </Button>
      </PageHeader>

      {/* 검색 */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="후원자명으로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 테이블 */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>날짜</TableHead>
            <TableHead>후원자</TableHead>
            <TableHead>금액</TableHead>
            <TableHead>방식</TableHead>
            <TableHead>결제수단</TableHead>
            <TableHead>공개</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data?.data?.length ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-[var(--color-text-secondary)]"
              >
                후원 내역이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            data.data.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>{formatDate(donation.createdAt)}</TableCell>
                <TableCell>{donation.donorName}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(donation.amount)}
                </TableCell>
                <TableCell>
                  {donation.isRecurring ? (
                    <Badge variant="secondary">정기</Badge>
                  ) : (
                    <Badge variant="outline">일시</Badge>
                  )}
                </TableCell>
                <TableCell>{donation.paymentMethod}</TableCell>
                <TableCell>
                  <Switch
                    checked={donation.isPublic}
                    onCheckedChange={() => handleTogglePublic(donation.id)}
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={STATUS_LABELS[donation.status]?.variant || "outline"}
                  >
                    {STATUS_LABELS[donation.status]?.label || donation.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 페이지네이션 */}
      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </Button>
          <span className="text-sm text-[var(--color-text-secondary)]">
            {page} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
