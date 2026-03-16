// 📁 파일 경로: components/finance/FinanceSummaryCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FinanceSummaryCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  format?: "currency" | "number" | "string";
  colorClass?: string;
}

export default function FinanceSummaryCard({
  title,
  value,
  icon: Icon,
  format = "currency",
  colorClass = "text-[var(--color-primary)]",
}: FinanceSummaryCardProps) {
  const displayValue =
    format === "currency"
      ? formatCurrency(value as number)
      : format === "number"
        ? (value as number).toLocaleString()
        : value;

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-background)]",
            colorClass
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">{title}</p>
          <p className={cn("text-2xl font-bold", colorClass)}>
            {displayValue}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
