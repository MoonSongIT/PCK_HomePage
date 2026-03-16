// 📁 파일 경로: lib/validations/finance.schema.ts

import { z } from "zod";

export const expenseCreateSchema = z.object({
  title: z.string().min(1, "항목명을 입력해주세요.").max(200),
  amount: z
    .number()
    .int("금액은 정수여야 합니다.")
    .min(1, "금액은 1원 이상이어야 합니다."),
  category: z.enum([
    "PEACE_EDUCATION",
    "CAMPAIGN",
    "INTERNATIONAL",
    "OPERATIONS",
    "RESERVE",
  ]),
  expenseDate: z.string().min(1, "날짜를 선택해주세요."),
  description: z.string().max(1000).optional(),
  receiptUrl: z.string().url().optional(),
  isPublic: z.boolean().default(false),
});

export const reportGenerateSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  period: z.enum(["Q1", "Q2", "Q3", "Q4", "annual"]),
});

export type ExpenseCreateInput = z.infer<typeof expenseCreateSchema>;
export type ReportGenerateInput = z.infer<typeof reportGenerateSchema>;
