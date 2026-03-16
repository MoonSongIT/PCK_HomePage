// 📁 파일 경로: lib/validations/api-key.schema.ts

import { z } from "zod";

export const apiKeyCreateSchema = z.object({
  serviceName: z
    .string()
    .min(1, "서비스명을 입력해주세요.")
    .max(100, "서비스명은 100자 이내여야 합니다."),
  keyIdentifier: z
    .string()
    .min(1, "식별자를 입력해주세요.")
    .max(50, "식별자는 50자 이내여야 합니다.")
    .regex(
      /^[A-Z][A-Z0-9_]*$/,
      "식별자는 영문 대문자, 숫자, 언더스코어만 사용 가능합니다."
    ),
  keyValue: z
    .string()
    .min(1, "API Key 값을 입력해주세요.")
    .max(500, "API Key는 500자 이내여야 합니다."),
  description: z
    .string()
    .max(255, "설명은 255자 이내여야 합니다.")
    .optional(),
  isActive: z.boolean().default(true),
});

export const apiKeyUpdateSchema = z.object({
  serviceName: z
    .string()
    .min(1, "서비스명을 입력해주세요.")
    .max(100)
    .optional(),
  keyIdentifier: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Z][A-Z0-9_]*$/)
    .optional(),
  keyValue: z.string().min(1).max(500).optional(),
  description: z.string().max(255).optional(),
  isActive: z.boolean().optional(),
});

export type ApiKeyCreateInput = z.infer<typeof apiKeyCreateSchema>;
export type ApiKeyUpdateInput = z.infer<typeof apiKeyUpdateSchema>;
