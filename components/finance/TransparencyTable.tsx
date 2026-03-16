// 📁 파일 경로: components/finance/TransparencyTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EXPENSE_CATEGORY_LABELS } from "@/types";
import type { DonationRecord, ExpenseRecord } from "@/types";

interface TransparencyTableProps {
  donations: DonationRecord[];
  expenses: ExpenseRecord[];
}

export default function TransparencyTable({
  donations,
  expenses,
}: TransparencyTableProps) {
  return (
    <div className="space-y-8">
      {/* 후원 수입 테이블 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
          후원 수입 내역
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableHead>내용</TableHead>
              <TableHead className="text-right">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-[var(--color-text-secondary)]">
                  공개된 후원 내역이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{formatDate(donation.createdAt)}</TableCell>
                  <TableCell>
                    후원금
                    {donation.isRecurring && (
                      <Badge variant="secondary" className="ml-2">
                        정기
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-[var(--color-primary)]">
                    {formatCurrency(donation.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 지출 테이블 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
          지출 내역
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableHead>항목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead className="text-right">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-[var(--color-text-secondary)]">
                  공개된 지출 내역이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.expenseDate)}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {EXPENSE_CATEGORY_LABELS[expense.category]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-[var(--color-accent)]">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
