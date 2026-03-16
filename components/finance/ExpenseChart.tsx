// 📁 파일 경로: components/finance/ExpenseChart.tsx
"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExpenseByCategoryData } from "@/types";

interface ExpenseChartProps {
  data: ExpenseByCategoryData[];
  title?: string;
}

const COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "#8884d8",
  "#82ca9d",
];

export default function ExpenseChart({
  data,
  title = "항목별 지출 비율",
}: ExpenseChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ label, percentage }) =>
                `${label} ${percentage.toFixed(1)}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="amount"
              nameKey="label"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
