// 📁 파일 경로: server/actions/api-key.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { encrypt, decrypt, getLastFourChars } from "@/lib/crypto";
import {
  apiKeyCreateSchema,
  apiKeyUpdateSchema,
} from "@/lib/validations/api-key.schema";
import type { ApiResponse, ApiKeyConfig } from "@/types";

/**
 * API Key 목록을 조회한다. (SUPER_ADMIN 전용)
 * 평문 key_value는 절대 반환하지 않는다.
 */
export async function listApiKeys(): Promise<
  ApiResponse<ApiKeyConfig[]>
> {
  try {
    await requireAuth(["SUPER_ADMIN"]);

    const keys = await db.apiKeyConfig.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 마지막 4자리만 복호화하여 반환
    const safeKeys: ApiKeyConfig[] = keys.map((key) => {
      let lastFourChars = "****";
      try {
        const plain = decrypt(
          key.encryptedValue,
          key.encryptedIv,
          key.encryptedTag
        );
        lastFourChars = getLastFourChars(plain);
      } catch {
        // 복호화 실패 시 기본 마스크 사용
      }

      return {
        id: key.id,
        serviceName: key.serviceName,
        keyIdentifier: key.keyIdentifier,
        description: key.description,
        isActive: key.isActive,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt,
        lastFourChars,
      };
    });

    return { success: true, data: safeKeys };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "API Key 조회에 실패했습니다.",
    };
  }
}

/**
 * 새 API Key를 등록한다. (SUPER_ADMIN 전용)
 */
export async function createApiKey(
  formData: unknown
): Promise<ApiResponse<{ id: string }>> {
  try {
    const user = await requireAuth(["SUPER_ADMIN"]);
    const parsed = apiKeyCreateSchema.parse(formData);

    // 중복 식별자 검사
    const existing = await db.apiKeyConfig.findUnique({
      where: { keyIdentifier: parsed.keyIdentifier },
    });
    if (existing) {
      return { success: false, error: "이미 등록된 식별자입니다." };
    }

    // AES-256-GCM 암호화
    const { encrypted, iv, tag } = encrypt(parsed.keyValue);

    const created = await db.apiKeyConfig.create({
      data: {
        serviceName: parsed.serviceName,
        keyIdentifier: parsed.keyIdentifier,
        encryptedValue: encrypted,
        encryptedIv: iv,
        encryptedTag: tag,
        description: parsed.description ?? null,
        isActive: parsed.isActive,
        createdById: user.id,
      },
    });

    revalidatePath("/admin/settings/api-keys");
    return { success: true, data: { id: created.id } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "API Key 등록에 실패했습니다.",
    };
  }
}

/**
 * API Key를 수정한다. (SUPER_ADMIN 전용)
 * keyValue가 제공되면 새로 암호화하여 저장한다.
 */
export async function updateApiKey(
  id: string,
  formData: unknown
): Promise<ApiResponse> {
  try {
    await requireAuth(["SUPER_ADMIN"]);
    const parsed = apiKeyUpdateSchema.parse(formData);

    const existing = await db.apiKeyConfig.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "API Key를 찾을 수 없습니다." };
    }

    // 식별자 변경 시 중복 검사
    if (
      parsed.keyIdentifier &&
      parsed.keyIdentifier !== existing.keyIdentifier
    ) {
      const dup = await db.apiKeyConfig.findUnique({
        where: { keyIdentifier: parsed.keyIdentifier },
      });
      if (dup) {
        return { success: false, error: "이미 등록된 식별자입니다." };
      }
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.serviceName !== undefined)
      updateData.serviceName = parsed.serviceName;
    if (parsed.keyIdentifier !== undefined)
      updateData.keyIdentifier = parsed.keyIdentifier;
    if (parsed.description !== undefined)
      updateData.description = parsed.description;
    if (parsed.isActive !== undefined) updateData.isActive = parsed.isActive;

    // 새 keyValue가 있으면 재암호화
    if (parsed.keyValue) {
      const { encrypted, iv, tag } = encrypt(parsed.keyValue);
      updateData.encryptedValue = encrypted;
      updateData.encryptedIv = iv;
      updateData.encryptedTag = tag;
    }

    await db.apiKeyConfig.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/settings/api-keys");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "API Key 수정에 실패했습니다.",
    };
  }
}

/**
 * API Key를 삭제한다. (SUPER_ADMIN 전용)
 */
export async function deleteApiKey(id: string): Promise<ApiResponse> {
  try {
    await requireAuth(["SUPER_ADMIN"]);

    await db.apiKeyConfig.delete({ where: { id } });

    revalidatePath("/admin/settings/api-keys");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "API Key 삭제에 실패했습니다.",
    };
  }
}
