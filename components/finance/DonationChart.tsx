// 📁 파일 경로: components/finance/DonationChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyFinanceData } from "@/types";

interface DonationChartProps {
  data: MonthlyFinanceData[];
  title?: string;
}

const formatAmount = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}백만`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(0)}만`;
  return value.toLocaleString();
};

export default function DonationChart({
  data,
  title = "월별 수입·지출 현황",
}: DonationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatAmount}
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()}원`,
              ]}
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="income"
              name="수입"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="지출"
              fill="var(--color-accent)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
