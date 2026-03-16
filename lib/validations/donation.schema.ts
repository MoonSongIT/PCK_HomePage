// 📁 파일 경로: lib/validations/donation.schema.ts

import { z } from "zod";

export const donationCreateSchema = z.object({
  donorName: z.string().min(1, "후원자명을 입력해주세요."),
  donorEmail: z.string().email("올바른 이메일 주소를 입력해주세요."),
  amount: z
    .number()
    .int("금액은 정수여야 합니다.")
    .min(1000, "최소 후원금은 1,000원입니다.")
    .max(100_000_000, "최대 후원금은 1억원입니다."),
  isRecurring: z.boolean().default(false),
  paymentMethod: z.string().min(1),
});

export const donationSearchSchema = z.object({
  donorName: z.string().optional(),
  email: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  isRecurring: z.boolean().optional(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED", "REFUNDED"]).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export type DonationCreateInput = z.infer<typeof donationCreateSchema>;
export type DonationSearchInput = z.infer<typeof donationSearchSchema>;
